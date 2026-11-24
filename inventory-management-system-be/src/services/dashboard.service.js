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

exports.getDashboardData = async () => {

  // ✅ Fetch ALL products (no status filter)
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
