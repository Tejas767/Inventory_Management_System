const prisma = require("../config/prisma");
const { findLinkedEmployee } = require("../utils/findLinkedEmployee");

/**
 * Custom API Error Helper
 */
class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ---------------- CREATE QUERY ----------------
const createQuery = async (data, user) => {
  const { title, description, priority, assetId } = data;
  let { employeeId } = data;

  if (user && user.role !== "ADMIN") {
    const linked = await findLinkedEmployee(user);
    if (!linked) {
      throw new ApiError(
        400,
        "QRY_003",
        "Your account is not linked to an employee profile yet. Contact an Admin."
      );
    }
    employeeId = linked.id;

    // Ensure the asset belongs to this employee
    const ownedAsset = await prisma.employeeAsset.findFirst({
      where: { id: assetId, employeeId: linked.id },
    });
    if (!ownedAsset) {
      throw new ApiError(403, "QRY_403", "You can only report issues for your own assigned assets");
    }
  }

  if (!title || !description || !employeeId || !assetId) {
    throw new ApiError(
      400,
      "QRY_001",
      "Missing required fields (title, description, employeeId, assetId)"
    );
  }

  return prisma.query.create({
    data: {
      title,
      description,
      priority,
      employeeId,
      assetId
    }
  });
};

// ---------------- GET ALL QUERIES ----------------
const getAllQueries = async (filters, user) => {
  const { status, priority, search } = filters;

  let scopedEmployeeId;
  if (user && user.role !== "ADMIN") {
    const linked = await findLinkedEmployee(user);
    if (!linked) {
      return [];
    }
    scopedEmployeeId = linked.id;
  }

  const queries = await prisma.query.findMany({
    where: {
      employeeId: scopedEmployeeId || undefined,
      status: status || undefined,
      priority: priority || undefined,
      OR: search
        ? [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
          ]
        : undefined
    },
    include: {
      employee: { select: { name: true } },
      asset: {
        include: {
          product: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return queries.map((q) => ({
    ...q,
    employee: q.employee?.name || "Unknown Employee",
    asset: q.asset?.product?.name || "Unknown Asset",
    date: q.createdAt ? new Date(q.createdAt).toISOString().split("T")[0] : "-"
  }));
};

// ---------------- GET QUERY BY ID ----------------
const getQueryById = async (id, user) => {
  const query = await prisma.query.findUnique({ where: { id } });

  if (!query) {
    throw new ApiError(404, "QRY_404", "Query not found");
  }

  if (user && user.role !== "ADMIN") {
    const linked = await findLinkedEmployee(user);
    if (!linked || query.employeeId !== linked.id) {
      throw new ApiError(403, "QRY_403", "Access denied");
    }
  }

  return query;
};

// ---------------- UPDATE QUERY ----------------
const updateQuery = async (id, data) => {
  try {
    return await prisma.query.update({
      where: { id },
      data
    });
  } catch (error) {
    throw new ApiError(404, "QRY_404", "Query not found");
  }
};

// ---------------- UPDATE QUERY STATUS ----------------
const updateQueryStatus = async (id, status) => {
  if (!["OPEN", "IN_PROGRESS", "CLOSED"].includes(status)) {
    throw new ApiError(400, "QRY_002", "Invalid status value");
  }

  try {
    return await prisma.query.update({
      where: { id },
      data: { status }
    });
  } catch (error) {
    throw new ApiError(404, "QRY_404", "Query not found");
  }
};

// ---------------- DELETE QUERY ----------------
const deleteQuery = async (id) => {
  try {
    return await prisma.query.delete({
      where: { id }
    });
  } catch (error) {
    throw new ApiError(404, "QRY_404", "Query not found");
  }
};

module.exports = {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQuery,
  updateQueryStatus,
  deleteQuery,
  ApiError
};
