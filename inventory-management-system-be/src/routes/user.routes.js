const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

// All user management routes are strictly Admin-only
router.use(verifyToken, isAdmin);

router.get("/", userController.getAllUsers);
router.patch("/:id/role", userController.updateUserRole);
router.post("/:id/link-employee", userController.linkEmployee);
router.delete("/:id", userController.deleteUser);

module.exports = router;
