// Allowed roles middleware
exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    // Make sure user is attached to req (from JWT middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Role is allowed
    next();
  };
};
