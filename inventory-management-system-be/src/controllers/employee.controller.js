
const service = require("../services/employee.service");

// ---------------- CREATE EMPLOYEE ----------------
exports.create = async (req, res) => {
  try {
    const employee = await service.createEmployee(req.body);

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: {
        code: "EMP_001",
        message: err.message || "Employee creation failed",
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};

// ---------------- GET ALL EMPLOYEES (SEARCHABLE) ----------------
exports.getAll = async (req, res) => {
  try {
    const search = req.query.search?.trim();

    const employees = await service.getAllEmployees(search);

    return res.status(200).json({
      success: true,
      data: employees,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: "EMP_500",
        message: "Failed to fetch employees",
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};

// ---------------- GET EMPLOYEE BY ID ----------------
exports.getById = async (req, res) => {
  try {
    const employee = await service.getEmployeeById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: {
          code: "EMP_404",
          message: "Employee not found",
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: "EMP_500",
        message: "Failed to fetch employee",
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};

// ---------------- UPDATE EMPLOYEE ----------------
exports.update = async (req, res) => {
  try {
    const employee = await service.updateEmployee(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: {
        code: "EMP_002",
        message: err.message || "Employee update failed",
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};

// ---------------- DELETE EMPLOYEE ----------------
exports.remove = async (req, res) => {
  try {
    await service.deleteEmployee(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: {
        code: "EMP_003",
        message: err.message || "Employee deletion failed",
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};
