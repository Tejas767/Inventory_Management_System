// const express = require("express");
// const router = express.Router();

// const controller = require("../controllers/dashboard.controller");
// const { verifyToken } = require("../middlewares/auth.middleware");
// const { allowRoles } = require("../middlewares/role.middleware");

// // Dashboard API (Admin and user)
// router.get(
//   "/",
//   verifyToken,           // user must be logged in
//   allowRoles("ADMIN","USER"),   // user and  admin can access dashboard
//   controller.getDashboard
// );

// module.exports = router;

const express = require("express");
const router = express.Router();

const controller = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard APIs (Admin & User)
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard data (Admin & User)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                   example: 50
 *                 totalCategories:
 *                   type: integer
 *                   example: 10
 *                 totalEmployees:
 *                   type: integer
 *                   example: 25
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       403:
 *         description: Forbidden (Role not allowed)
 */
router.get(
  "/",
  verifyToken,              // user must be logged in
  allowRoles("ADMIN", "USER"), // Admin & User can access
  controller.getDashboard
);

module.exports = router;
