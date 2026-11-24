const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//=============== Create Category ==================
 
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: {
          code: "CAT_001",
          message: "Category name is required",
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        }
      });
    }

    const category = await prisma.category.create({
      data: { name }
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: {
          code: "CAT_002",
          message: "Category already exists",
          details: "Duplicate category name",
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: "CAT_500",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};

//====== Get All Categories - GET /api/categories ===========
 
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }
    });

    res.json({
      success: true,
      data: categories,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "CAT_500",
        message: "Failed to fetch categories",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};

//================= Get Category by ID =====================
 
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: {
          code: "CAT_404",
          message: "Category not found",
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        }
      });
    }

    res.json({
      success: true,
      data: category,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "CAT_500",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};

//============= Update Category ================
 
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: { name }
    });

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      error: {
        code: "CAT_404",
        message: "Category not found",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};

//=========== Delete Category ======================
 
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: "Category deleted successfully",
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      error: {
        code: "CAT_404",
        message: "Category not found",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }
};
