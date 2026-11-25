// const express = require("express");
// const router = express.Router();
// const queryController = require("../controllers/query.controller");

// router.post("/", queryController.createQuery);
// router.get("/", queryController.getAllQueries);
// router.get("/:id", queryController.getQueryById);
// router.put("/:id", queryController.updateQuery);
// router.patch("/:id/status", queryController.updateQueryStatus);
// router.delete("/:id", queryController.deleteQuery);

// module.exports = router;

const express = require("express");
const router = express.Router();
const queryController = require("../controllers/query.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

/**
 * @swagger
 * tags:
 *   name: Queries
 *   description: Manage user queries / support tickets
 */

/**
 * @swagger
 * /api/queries:
 *   post:
 *     summary: Create a new query
 *     tags: [Queries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Laptop not working
 *               description:
 *                 type: string
 *                 example: My assigned laptop is not starting.
 *               priority:
 *                 type: string
 *                 example: High
 *               status:
 *                 type: string
 *                 example: Open
 *     responses:
 *       201:
 *         description: Query created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", verifyToken, queryController.createQuery);

/**
 * @swagger
 * /api/queries:
 *   get:
 *     summary: Get all queries
 *     tags: [Queries]
 *     responses:
 *       200:
 *         description: List of queries fetched successfully
 */
router.get("/", verifyToken, queryController.getAllQueries);

/**
 * @swagger
 * /api/queries/{id}:
 *   get:
 *     summary: Get query by ID
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Query ID
 *     responses:
 *       200:
 *         description: Query fetched successfully
 *       404:
 *         description: Query not found
 */
router.get("/:id", verifyToken, queryController.getQueryById);

/**
 * @swagger
 * /api/queries/{id}:
 *   put:
 *     summary: Update query by ID
 *     tags: [Queries]  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Query ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Query updated successfully
 *       404:
 *         description: Query not found
 */
router.put("/:id", verifyToken, isAdmin, queryController.updateQuery);

/**
 * @swagger
 * /api/queries/{id}/status:
 *   patch:
 *     summary: Update query status
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Query ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: Resolved
 *     responses:
 *       200:
 *         description: Query status updated successfully
 *       404:
 *         description: Query not found
 */
router.patch("/:id/status", verifyToken, isAdmin, queryController.updateQueryStatus);

/**
 * @swagger
 * /api/queries/{id}:
 *   delete:
 *     summary: Delete query by ID
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Query ID
 *     responses:
 *       200:
 *         description: Query deleted successfully
 *       404:
 *         description: Query not found
 */
router.delete("/:id", verifyToken, isAdmin, queryController.deleteQuery);

module.exports = router;

