// const prisma = require("../config/prisma");

// // Business rule: minimum stock limit
// // (later you can move this to DB or env)
// const MIN_STOCK = 5;

// exports.getDashboardData = async () => {
//   //  Fetch all ACTIVE products with category
//   const products = await prisma.product.findMany({
//     where: { status: "Available" },
//     include: { category: true },
//   });

//   //  Initialize card values
//   let totalStock = 0;        // total quantity
//   let allocatedAssets = 0;  // total allocated
//   let availableStock = 0;   // quantity - allocated
//   let lowStockAlerts = 0;   // count of low/out stock products

//   //  Table data (Low stock alerts table)
//   const lowStockTable = [];

//   //  Loop through products to calculate values
//   for (const product of products) {
//     const available = product.quantity - product.allocated;

//     // Card calculations
//     totalStock += product.quantity;
//     allocatedAssets += product.allocated;
//     availableStock += available;

//     // Check LOW / OUT OF STOCK
//     if (available === 0 || available <= MIN_STOCK) {
//       lowStockAlerts++;

//       lowStockTable.push({
//         productName: product.name,
//         category: product.category.name,
//         currentStock: available,
//         minStock: MIN_STOCK,
//         status: available === 0 ? "OUT_OF_STOCK" : "LOW_STOCK",
//       });
//     }
//   }

//   // 5️⃣ Total employees count
//   const totalEmployees = await prisma.employee.count();

  
//   const openQueries = await prisma.query.count({
//     where: { status: "OPEN" },                                 
//   });

  
//   return {
//     cards: {
//       totalStock,
//       availableStock,
//       allocatedAssets,
//       lowStockAlerts,
//       totalEmployees,
//       openQueries,
//     },
//     lowStockTable,
//   };
// };

const prisma = require("../config/prisma");
const { findLinkedEmployee } = require("../utils/findLinkedEmployee");

exports.getDashboardData = async (user) => {
  // User-scoped self-service dashboard for non-ADMIN roles
  if (user && user.role !== "ADMIN") {
    const linkedEmployee = await findLinkedEmployee(user);

    const products = await prisma.product.findMany({
      select: { quantity: true, allocated: true },
    });
    const availableProductsCount = products.filter(
      (p) => p.quantity - p.allocated > 0
    ).length;

    if (!linkedEmployee) {
      return {
        role: "USER",
        linkedEmployee: null,
        cards: {
          myAssetsCount: 0,
          myOpenQueries: 0,
          myInProgressQueries: 0,
          myClosedQueries: 0,
          availableProductsCount,
        },
        myAssets: [],
        myRecentQueries: [],
      };
    }

    const [myAssets, myQueries] = await Promise.all([
      prisma.employeeAsset.findMany({
        where: { employeeId: linkedEmployee.id },
        include: {
          product: {
            select: {
              name: true,
              serialNumber: true,
              category: { select: { name: true } },
            },
          },
        },
        orderBy: { allocatedDate: "desc" },
      }),
      prisma.query.findMany({
        where: { employeeId: linkedEmployee.id },
        include: {
          asset: {
            include: { product: { select: { name: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const myOpenQueries = myQueries.filter((q) => q.status === "OPEN").length;
    const myInProgressQueries = myQueries.filter(
      (q) => q.status === "IN_PROGRESS"
    ).length;
    const myClosedQueries = myQueries.filter((q) => q.status === "CLOSED").length;

    return {
      role: "USER",
      linkedEmployee: {
        id: linkedEmployee.id,
        employeeId: linkedEmployee.employeeId,
        name: linkedEmployee.name,
        department: linkedEmployee.department,
        position: linkedEmployee.position,
      },
      cards: {
        myAssetsCount: myAssets.length,
        myOpenQueries,
        myInProgressQueries,
        myClosedQueries,
        availableProductsCount,
      },
      myAssets: myAssets.map((a) => ({
        assignmentId: a.id,
        assetName: a.product.name,
        category: a.product.category?.name || "N/A",
        serialNumber: a.product.serialNumber,
        allocatedDate: a.allocatedDate,
      })),
      myRecentQueries: myQueries.slice(0, 5).map((q) => ({
        id: q.id,
        title: q.title,
        priority: q.priority,
        status: q.status,
        asset: q.asset?.product?.name || "Unknown Asset",
        date: q.createdAt ? new Date(q.createdAt).toISOString().split("T")[0] : "-",
      })),
    };
  }

  // ✅ Admin: Fetch ALL products (no status filter)
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  let totalStock = 0;
  let allocatedAssets = 0;
  let availableStock = 0;
  let lowStockAlerts = 0;

  const lowStockTable = [];

  for (const product of products) {
    const available = product.quantity - product.allocated;

    totalStock += product.quantity;
    allocatedAssets += product.allocated;
    availableStock += available;

    const minStock = product.minStock || 0;

    if (available <= minStock) {
      lowStockAlerts++;

      lowStockTable.push({
        productName: product.name,
        category: product.category?.name || "N/A",
        currentStock: available,
        minStock: minStock,
        status: available === 0 ? "OUT OF STOCK" : "LOW STOCK",
      });
    }
  }

  const totalEmployees = await prisma.employee.count();

  const openQueries = await prisma.query.count({
    where: { status: "OPEN" },
  });

  return {
    role: "ADMIN",
    cards: {
      totalStock,
      availableStock,
      allocatedAssets,
      lowStockAlerts,
      totalEmployees,
      openQueries,
    },
    lowStockTable,
  };
};
