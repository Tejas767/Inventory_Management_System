// const express = require("express");
// const router = express.Router();

// const {
//   register,
//   login,
//   forgotPassword,
//   verifyOtp,
//   resetPassword,
//   getMe,
//   deleteMe,
//   refreshToken,
//   logout,

// } = require("../controllers/auth.controller");

// const { verifyToken } = require("../middlewares/auth.middleware");
// //const { allowRoles } = require("../middlewares/role.middleware");

// // ---------------- PUBLIC ROUTES ----------------
// router.post("/register", register);
// router.post("/login", login);
// router.post("/refresh",refreshToken);
// router.post("/logout", verifyToken,logout);



// // Forgot password flow
// router.post("/forgot-password", forgotPassword);
// router.post("/verify-otp", verifyOtp);
// router.post("/reset-password", resetPassword);

// // ---------------- PROTECTED ROUTES ----------------

// // Current logged-in user
// router.get("/me", verifyToken, getMe);

// // Delete current user
// router.delete("/me", verifyToken, deleteMe);

// //phase 2 

// // // Admin-only route
// // router.get(
// //   "/admin-dashboard",
// //   verifyToken,
// //   allowRoles("ADMIN"),
// //   (req, res) => {
// //     res.json({ message: "Welcome Admin" });
// //   }
// // );

// // // ADMIN or USER
// // router.get(
// //   "/profile",
// //   verifyToken,
// //   allowRoles("ADMIN", "USER"),
// //   (req, res) => {
// //     res.json({ message: `Welcome ${req.user.role}`, user: req.user });
// //   }
// // );

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getMe,
  deleteMe,
  refreshToken,
  logout,
} = require("../controllers/auth.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post("/refresh", refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", verifyToken, logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send OTP to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched
 *       401:
 *         description: Unauthorized
 */
router.get("/me", verifyToken, getMe);

/**
 * @swagger
 * /api/auth/me:
 *   delete:
 *     summary: Delete current logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/me", verifyToken, deleteMe);

module.exports = router;
