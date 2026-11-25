const prisma = require("../config/prisma");
const generateEmployeeId = require("../utils/generateEmployeeId");

/**
 * GET /api/users — List all users with their linked employee info (Admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const [users, employees] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.employee.findMany({
        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          department: true,
          position: true,
          userId: true,
        },
        orderBy: { employeeNo: "asc" },
      }),
    ]);

    const employeeByUserId = new Map();
    for (const emp of employees) {
      if (emp.userId) employeeByUserId.set(emp.userId, emp);
    }

    const enrichedUsers = users.map((u) => ({
      ...u,
      linkedEmployee: employeeByUserId.get(u.id) || null,
    }));

    return res.status(200).json({
      success: true,
      data: {
        users: enrichedUsers,
        employees,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

/**
 * PATCH /api/users/:id/role — Promote/demote user role (Admin only)
 */
exports.updateUserRole = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const { role } = req.body;

    if (!["ADMIN", "USER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be ADMIN or USER",
      });
    }

    if (Number.isNaN(targetId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (targetId === req.user.id && role !== "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "You cannot demote your own Admin account",
      });
    }

    const existing = await prisma.user.findUnique({ where: { id: targetId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id: targetId },
      data: { role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update user role",
    });
  }
};

/**
 * POST /api/users/:id/link-employee — Link/unlink or create an Employee profile for a User (Admin only)
 */
exports.linkEmployee = async (req, res) => {
  try {
    const targetUserId = Number(req.params.id);
    const { employeeId, createNew, department, position, joiningDate } = req.body;

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Clear any existing employee link for this user first
    await prisma.employee.updateMany({
      where: { userId: targetUserId },
      data: { userId: null },
    });

    if (createNew) {
      const existingByEmail = await prisma.employee.findUnique({
        where: { email: user.email },
      });

      let linked;
      if (existingByEmail) {
        linked = await prisma.employee.update({
          where: { id: existingByEmail.id },
          data: { userId: targetUserId },
        });
      } else {
        const created = await prisma.employee.create({
          data: {
            name: user.name,
            email: user.email,
            department: department || "General",
            position: position || "Staff",
            joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
            userId: targetUserId,
          },
        });
        linked = await prisma.employee.update({
          where: { id: created.id },
          data: { employeeId: generateEmployeeId(created.employeeNo) },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Employee profile created and linked",
        data: linked,
      });
    }

    if (!employeeId) {
      return res.status(200).json({
        success: true,
        message: "Employee unlinked from user",
        data: null,
      });
    }

    const linked = await prisma.employee.update({
      where: { id: employeeId },
      data: { userId: targetUserId },
    });

    return res.status(200).json({
      success: true,
      message: "Employee linked to user",
      data: linked,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to link employee",
    });
  }
};

/**
 * DELETE /api/users/:id — Delete a user account (Admin only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const targetId = Number(req.params.id);

    if (Number.isNaN(targetId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (targetId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own active Admin account",
      });
    }

    const existing = await prisma.user.findUnique({ where: { id: targetId } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "User already deleted or not found",
      });
    }

    await prisma.employee.updateMany({
      where: { userId: targetId },
      data: { userId: null },
    });

    await prisma.user.deleteMany({ where: { id: targetId } });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};
