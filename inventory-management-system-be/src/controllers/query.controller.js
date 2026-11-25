const queryService = require("../services/query.service");

// ---------------- CREATE QUERY ----------------
const createQuery = async (req, res) => {
  try {
    const result = await queryService.createQuery(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Query created successfully",
      data: result,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      error: {
        code: error.code || "QRY_500",
        message: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};

// ---------------- GET ALL QUERIES ----------------
const getAllQueries = async (req, res) => {
  try {
    const result = await queryService.getAllQueries(req.query, req.user);

    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: error.code || "QRY_500",
        message: error.message || "Failed to fetch queries",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};

// ---------------- GET QUERY BY ID ----------------
const getQueryById = async (req, res) => {
  try {
    const result = await queryService.getQueryById(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    return res.status(error.status || 404).json({
      success: false,
      error: {
        code: error.code || "QRY_404",
        message: error.message || "Query not found",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};

// ---------------- UPDATE QUERY ----------------
const updateQuery = async (req, res) => {
  try {
    const result = await queryService.updateQuery(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Query updated successfully",
      data: result,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      error: {
        code: error.code || "QRY_500",
        message: error.message || "Failed to update query",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};

// ---------------- UPDATE QUERY STATUS ----------------
const updateQueryStatus = async (req, res) => {
  try {
    const result = await queryService.updateQueryStatus(
      req.params.id,
      req.body.status
    );

    return res.status(200).json({
      success: true,
      message: "Query status updated successfully",
      data: result,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      error: {
        code: error.code || "QRY_002",
        message: error.message || "Invalid status update",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};

// ---------------- DELETE QUERY ----------------
const deleteQuery = async (req, res) => {
  try {
    await queryService.deleteQuery(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Query deleted successfully",
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      error: {
        code: error.code || "QRY_404",
        message: error.message || "Failed to delete query",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};

module.exports = {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQuery,
  updateQueryStatus,
  deleteQuery
};
