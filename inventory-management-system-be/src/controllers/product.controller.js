
const productService = require("../services/product.service");

// CREATE
const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET (filters + pagination)
const getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, name, category, serialNumber } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const { products, total } = await productService.getProducts({
      page,
      limit,
      name,
      category,
      serialNumber,
    });

    const response = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category.name,
      serialNumber: p.serialNumber,
      quantity: p.quantity,
      allocated: p.allocated,
      available: p.quantity - p.allocated,
      status: p.status,
    }));

    res.json({
      success: true,
      data: response,
      pagination: {
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ALLOCATE
const allocateProduct = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const result = await productService.allocateProduct(productId, qty);

    res.json({
      success: true,
      message: "Product allocated successfully",
      data: {
        ...result,
        available: result.quantity - result.allocated,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PRODUCT (ALL FIELDS)

const updateProduct = async (req, res) => {
  try {
    const updated = await productService.updateProduct(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE
// DELETE
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    await productService.deleteProduct(id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
