// require("dotenv").config();

// const cors = require("cors");
// const express = require("express");

// const authRoutes = require("./routes/auth.routes.js");
// const productRoutes = require("./routes/product.routes.js"); 
// const employeeRoutes = require("./routes/employee.routes.js");
// const employeeAssetRoutes = require("./routes/employeeAsset.routes.js");
// const categoryRoutes = require("./routes/category.routes.js");
// const queryRoutes = require("./routes/query.routes");


// const dashboardRoutes = require("./routes/dashboard.routes.js");
// const { getDashboard } = require("./controllers/dashboard.controller.js");

// const cookieParser = require("cookie-parser");
// const app = express();


// app.use(cors({
//   origin: ["http://localhost:3000",
//     "https://vn77g9mv-3000.inc1.devtunnels.ms/"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// // -------- MIDDLEWARE --------

// app.use(express.json());
// app.use(cookieParser());

// // -------- ROUTES --------

// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/employees", employeeRoutes);
// app.use("/api/employee-assets", employeeAssetRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/queries", queryRoutes);
// app.use("/api/dashboard",dashboardRoutes)


// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// require("dotenv").config();



// const cors = require("cors");
// const express = require("express");
// const cookieParser = require("cookie-parser");


// const authRoutes = require("./routes/auth.routes.js");
// const productRoutes = require("./routes/product.routes.js"); 
// const employeeRoutes = require("./routes/employee.routes.js");
// const employeeAssetRoutes = require("./routes/employeeAsset.routes.js");
// const categoryRoutes = require("./routes/category.routes.js");
// const queryRoutes = require("./routes/query.routes");
// const dashboardRoutes = require("./routes/dashboard.routes.js");

// const swaggerUi = require("swagger-ui-express");
// const swaggerSpec = require("./swagger");


// const cookieParser = require("cookie-parser");
// const app = express();

// //app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "http://localhost:3001",
//     "https://vn77g9mv-3001.inc1.devtunnels.ms",  // ✅ frontend tunnel URL
//     //"https://vn77g9mv-3001.inc1.devtunnels.ms"  // ✅ add frontend tunnel if different
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,  // ✅ This must be true for cookies
// }));

// // -------- MIDDLEWARE --------
// app.use(express.json());
// app.use(cookieParser());



// // -------- ROUTES --------
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/employees", employeeRoutes);
// app.use("/api/employee-assets", employeeAssetRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/queries", queryRoutes);
// app.use("/api/dashboard", dashboardRoutes);

// const PORT = process.env.PORT || 3000;

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   console.log(`Swagger running on http://localhost:${PORT}/api-docs`);
// });


require("dotenv").config();

const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const { swaggerUi, specs } = require("./config/swagger");

const authRoutes = require("./routes/auth.routes.js");
const productRoutes = require("./routes/product.routes.js"); 
const employeeRoutes = require("./routes/employee.routes.js");
const employeeAssetRoutes = require("./routes/employeeAsset.routes.js");
const categoryRoutes = require("./routes/category.routes.js");
const queryRoutes = require("./routes/query.routes");
const dashboardRoutes = require("./routes/dashboard.routes.js");

const app = express();

// -------- CORS --------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://vn77g9mv-3001.inc1.devtunnels.ms",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy blocked this origin: " + origin));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// -------- MIDDLEWARE --------
app.use(express.json());
app.use(cookieParser());

// -------- SWAGGER --------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// -------- ROUTES --------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employee-assets", employeeAssetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger running on http://localhost:${PORT}/api-docs`);
});

module.exports = app;