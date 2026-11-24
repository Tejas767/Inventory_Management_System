const prisma = require("../config/prisma");

/**
 * GET assets allocated to one employee ( Eye button)
 */
exports.getEmployeeAssets = async (req, res) => {
  const { employeeId } = req.params;

  const assets = await prisma.employeeAsset.findMany({
    where: { employeeId },
    include: {
      product: {
        select: {
          name: true,
          serialNumber: true,
          category: { select: { name: true } }
        }
      }
    }
  });

  res.json({
    success: true,
    data: assets.map(a => ({
      assignmentId: a.id,
      assetName: a.product.name,
      category: a.product.category.name,
      serialNumber: a.product.serialNumber,
      allocatedDate: a.allocatedDate
    }))
  });
};

/**
 * POST allocate asset (  box button)
 */
exports.allocateAsset = async (req, res) => {
  const { employeeId, productId } = req.body;

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product || product.quantity - product.allocated <= 0) {
    return res.status(400).json({
      success: false,
      message: "Product not available"
    });
  }

  // await prisma.$transaction([
  //   prisma.employeeAsset.create({ data: { employeeId, productId } }),
  //   prisma.product.update({
  //     where: { id: productId },
  //     data: { allocated: { increment: 1 } }
  //   })
  // ]);

const [allocation] = await prisma.$transaction([
    prisma.employeeAsset.create({
      data: { employeeId, productId }
    }),
    prisma.product.update({
      where: { id: productId },
      data: { allocated: { increment: 1 } }
    })
  ]);  

  res.json({
    success: true,
    message: "Asset allocated successfully",
     data: {
    assetId: allocation.id
  }
  });
};

/**
 * DELETE allocated asset (🗑 inside eye modal)
 */
exports.deleteEmployeeAsset = async (req, res) => {
  const { id } = req.params;

  const asset = await prisma.employeeAsset.findUnique({ where: { id } });

  if (!asset) {
    return res.status(404).json({
      success: false,
      message: "Asset not found"
    });
  }

  await prisma.$transaction([
    prisma.employeeAsset.delete({ where: { id } }),
    prisma.product.update({
      where: { id: asset.productId },
      data: { allocated: { decrement: 1 } }
    })
  ]);

  res.json({
    success: true,
    message: "Asset removed",
    
  });
};