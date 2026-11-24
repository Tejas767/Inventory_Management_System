
const prisma = require("../config/prisma");
 
// CREATE PRODUCT
const createProduct = async (data) => {
  const {
    name,
    categoryId,
    quantity,
    minStock,
    serialNumber,
    purchaseDate
  } = data;
 
  if (!categoryId || typeof categoryId !== "string") {
    throw new Error("Valid categoryId (UUID) is required");
  }
 
  return prisma.product.create({
    data: {
      name,
      categoryId, // ✅ NO Number()
      quantity: Number(quantity),
      minStock: minStock ? Number(minStock) : 0,
      serialNumber,
      allocated: 0,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null
    }
  });
};
 
 
 
// GET PRODUCTS
const getProducts = async ({ page, limit, name, category, serialNumber }) => {
  const skip = (page - 1) * limit;
 
  const where = {
    AND: [
      name && { name: { contains: name, mode: "insensitive" } },
      serialNumber && {
        serialNumber: { contains: serialNumber, mode: "insensitive" }
      },
      category && {
        category: {
          name: { contains: category, mode: "insensitive" }
        }
      }
    ].filter(Boolean)
  };
 
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.product.count({ where })
  ]);
 
  // 🔥 Add Dynamic Status Logic Here
  const updatedProducts = products.map(product => {
    const available = product.quantity - product.allocated;
 
    let status = "Available";
 
    if (available <= 0) {
      status = "Out of Stock";
    } else if (available <= product.minStock) {
      status = "Low Stock";
    }
 
    return {
      ...product,
       minStock: product.minStock,
      available,
      status
    };
  });
 
  return { products: updatedProducts, total };
};
 
 
// UPDATE PRODUCT
const updateProduct = async (id, data) => {
  if (!id) throw new Error("Product ID is required");
 
  const updateData = {};
 
  if (data.name !== undefined) updateData.name = data.name;
  if (data.serialNumber !== undefined)
    updateData.serialNumber = data.serialNumber;
 
  if (data.categoryId !== undefined) {
    if (typeof data.categoryId !== "string") {
      throw new Error("Invalid categoryId");
    }
    updateData.categoryId = data.categoryId;
  }
 
  if (data.quantity !== undefined)
    updateData.quantity = Number(data.quantity);
 
  if (data.minStock !== undefined)
    updateData.minStock = Number(data.minStock);
 
  if (data.purchaseDate !== undefined)
    updateData.purchaseDate = new Date(data.purchaseDate);
 
  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields to update");
  }
 
  return prisma.product.update({
    where: { id },
    data: updateData
  });
};
 
 
// ALLOCATE PRODUCT
const allocateProduct = async (productId, qty) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId } // ⚠ remove Number() if UUID
    });
 
    if (!product) throw new Error("Product not found");
 
    const available = product.quantity - product.allocated;
 
    if (available < qty) {
      throw new Error("Insufficient stock");
    }
 
    const remainingAfterAllocation = available - qty;
 
    // 🔴 Block allocation if it goes below minStock
    if (remainingAfterAllocation < product.minStock) {
      throw new Error(
        `Cannot allocate. Minimum stock level (${product.minStock}) must be maintained`
      );
    }
 
    return tx.product.update({
      where: { id: productId },
      data: {
        allocated: { increment: qty }
      }
    });
  });
};
 
// DELETE PRODUCT (UUID)
const deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { allocated: true },
  });
 
  if (!product) {
    throw new Error("Product not found");
  }
 
  if (product.allocated > 0) {
    throw new Error("Cannot delete allocated product");
  }
 
  return prisma.product.delete({
    where: { id },
  });
};
 
module.exports = {
  deleteProduct,
};
 
 
module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  allocateProduct,
  deleteProduct
};
 
 