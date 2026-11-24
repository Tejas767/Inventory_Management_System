// const express = require("express");

// const router = express.Router();

// const productController = require("../controllers/product.controller");

// router.post("/", productController.createProduct);
// router.get("/", productController.getProducts);
// //router.post("/allocate", productController.allocateProduct);
// router.put("/:id", productController.updateProduct);
// // router.patch("/:id/status", productController.updateStatus);
// router.delete("/:id", productController.deleteProduct);

// module.exports = router;

const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product Management APIs
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               category:
 *                 type: string
 *                 example: Electronics
 *               quantity:
 *                 type: integer
 *                 example: 10
 *               price:
 *                 type: number
 *                 example: 55000
 *               status:
 *                 type: string
 *                 example: Available
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", productController.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully fetched product list
 */
router.get("/", productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put("/:id", productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", productController.deleteProduct);

module.exports = router;


