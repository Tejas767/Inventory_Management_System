const dashboardService = require("../services/dashboard.service.js");


exports.getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData(req.user);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
