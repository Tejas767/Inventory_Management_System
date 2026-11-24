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
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || origin.endsWith(".netlify.app")) {
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

// -------- ROOT STATUS ROUTE --------
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Inventory Management System API is running successfully!",
    docs: "/api-docs"
  });
});

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
