// const router = require("express").Router();
// const controller = require("../controllers/employeeAsset.controller");

// router.post("/", controller.allocateAsset);
// router.delete("/:id", controller.deleteEmployeeAsset);

// module.exports = router;

const router = require("express").Router();
const controller = require("../controllers/employeeAsset.controller");

/**
 * @swagger
 * tags:
 *   name: Employee Assets
 *   description: Manage employee asset allocation
 */

/**
 * @swagger
 * /api/employee-assets:
 *   post:
 *     summary: Allocate asset to employee
 *     tags: [Employee Assets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - assetId
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: 65f2a1c3b1234567890abcd1
 *               assetId:
 *                 type: string
 *                 example: 65f2a1c3b1234567890abcd2
 *               assignedDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-10
 *     responses:
 *       201:
 *         description: Asset allocated successfully
 *       400:
 *         description: Bad request
 */
router.post("/", controller.allocateAsset);

/**
 * @swagger
 * /api/employee-assets/{id}:
 *   delete:
 *     summary: Remove allocated asset from employee
 *     tags: [Employee Assets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee Asset allocation ID
 *     responses:
 *       200:
 *         description: Employee asset removed successfully
 *       404:
 *         description: Allocation not found
 */
router.delete("/:id", controller.deleteEmployeeAsset);

module.exports = router;
