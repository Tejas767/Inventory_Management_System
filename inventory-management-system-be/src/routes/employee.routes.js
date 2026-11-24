// const router = require("express").Router();
// const controller = require("../controllers/employee.controller.js");
// const { verifyToken } = require("../middlewares/auth.middleware.js");
// const isAdmin = require("../middlewares/isAdmin.middleware.js");
// const assetCtrl= require("../controllers/employeeAsset.controller.js")

// router.post("/", verifyToken, isAdmin, controller.create);
// router.get("/", verifyToken, isAdmin, controller.getAll);
// router.get("/:id", verifyToken, isAdmin, controller.getById);
// router.put("/:id", verifyToken, isAdmin, controller.update);
// router.delete("/:id", verifyToken, isAdmin, controller.remove);

// router.get("/:employeeId/assets", assetCtrl.getEmployeeAssets);



// module.exports = router;

const router = require("express").Router();
const controller = require("../controllers/employee.controller.js");
const { verifyToken } = require("../middlewares/auth.middleware.js");
const isAdmin = require("../middlewares/isAdmin.middleware.js");
const assetCtrl = require("../controllers/employeeAsset.controller.js");

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management APIs (Admin Only)
 */

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create new employee (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               role:
 *                 type: string
 *                 example: USER
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/", verifyToken, isAdmin, controller.create);

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/",  controller.getAll);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get employee by ID (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee found
 *       404:
 *         description: Employee not found
 */
router.get("/:id", verifyToken, isAdmin, controller.getById);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Update employee by ID (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 */
router.put("/:id", verifyToken, isAdmin, controller.update);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete employee by ID (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router.delete("/:id", verifyToken, isAdmin, controller.remove);

/**
 * @swagger
 * /api/employees/{employeeId}/assets:
 *   get:
 *     summary: Get assets assigned to an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee assets fetched successfully
 *       404:
 *         description: Employee not found
 */
router.get("/:employeeId/assets", assetCtrl.getEmployeeAssets);

module.exports = router;
