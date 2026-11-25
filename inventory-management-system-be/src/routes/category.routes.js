// const express = require("express");
// const {
//   createCategory,
//   getCategories,
//   getCategoryById,
//   updateCategory,
//   deleteCategory
// } = require("../controllers/category.controller");

// const router = express.Router();

// router.post("/", createCategory);
// router.get("/", getCategories);
// router.get("/:id", getCategoryById);
// router.put("/:id", updateCategory);
// router.delete("/:id", deleteCategory);

// module.exports = router;

const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../controllers/category.controller");

const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Electronic items category
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", verifyToken, isAdmin, createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", verifyToken, getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 */
router.get("/:id", verifyToken, getCategoryById);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put("/:id", verifyToken, isAdmin, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

module.exports = router;

