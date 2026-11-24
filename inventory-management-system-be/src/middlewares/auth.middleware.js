// const jwt = require("jsonwebtoken");
// const prisma = require("../config/prisma");
// exports.verifyToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer")) {
//     return res.status(401).json({ message: "Access token required" });
//   }

//   const token = authHeader.split(" ")[1];

//   //  CHECK BLACKLIST FIRST
//   const blacklisted = await prisma.blacklistedToken.findUnique({
//     where: { token }
//   });

//   if (blacklisted) {
//     return res.status(401).json({ message: "Token is blacklisted" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id, email, role }
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// After adding refresh token
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
 
exports.verifyToken = async (req, res, next) => {
  try {
    //  GET TOKEN FROM COOKIE INSTEAD OF HEADER
    const token = req.cookies.accessToken; 
 
    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }
 
    //  CHECK BLACKLIST
    const blacklisted = await prisma.blacklistedToken.findUnique({
      where: { token },
    });
 
    if (blacklisted) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }
 
    //  VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    req.user = decoded; // { id, email, role }
    next();
 
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};