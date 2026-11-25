require("dotenv").config();
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOtp } = require("../utils/otp.js");
const { sendOtpMail } = require("../utils/sendMail.js");
const { findLinkedEmployee } = require("../utils/findLinkedEmployee.js");

// -------------------- REGISTER ------------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: "ONB_030",
          message: "Email already registered",
          details: "A user with this email already exists",
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Public signup always assigns USER role (Admins promote users internally)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    // Auto-link with an existing Employee profile if email matches
    await findLinkedEmployee({ id: user.id, email: user.email, role: user.role });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "ONB_050",
        message: "Internal server error",
        details: error.message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};

// ------------------------ LOGIN ------------------------
exports.login = async (req, res) => {
  console.log("CONTENT-TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("User from DB:", user);   // 👈 ADD THIS

    if (!user) {
      console.log("User NOT found ❌");    // 👈 ADD THIS
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_001",
          message: "Invalid email or password",
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isPasswordMatch);  // 👈 ADD THIS

    if (!isPasswordMatch) {
      console.log("Password NOT match ❌");  
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_001",
          message: "Invalid email or password",
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }

    // Access token 
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
     // { expiresIn:"15min" }
      { expiresIn:process.env.ACCESS_TOKEN_Expiry || "1d"}
      
    );

    //refresh token
    const refreshToken = jwt.sign(
  { id: user.id },
  process.env.REFRESH_TOKEN_SECRET,
 // { expiresIn: "7d" }
  { expiresIn: process.env.REFRESH_TOKEN_Expiry || "7d" }
  
);


// Save refresh token in DB
await prisma.user.update({
  where: { id: user.id },
  data: { refreshToken }
});

// 🍪 SEND COOKIES
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    path: "/"
  };

    res.cookie("accessToken", token, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
       path: '/' // Add explicit path
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
       path: '/'
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        //refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "AUTH_500",
        message: "Internal server error",
        details: error.message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};





// ---------------- FORGOT PASSWORD (SEND OTP) ----------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "ONB_404",
          message: "User not found",
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.user.update({
      where: { email },
      data: {
        resetOtp: hashedOtp,
        resetOtpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendOtpMail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "ONB_050",
        message: "Internal server error",
        details: error.message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};

// ---------------- VERIFY OTP ----------------
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetOtp || user.resetOtpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "ONB_021",
          message: "OTP expired or invalid",
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }

    const isValidOtp = await bcrypt.compare(otp, user.resetOtp);
    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        error: {
          code: "ONB_022",
          message: "Invalid OTP",
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "ONB_050",
        message: "Internal server error",
        details: error.message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};

// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpiry: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "ONB_050",
        message: "Internal server error",
        details: error.message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};

//--------------------current user ------------

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT(Middleware)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const linkedEmployee = await findLinkedEmployee(user);

    res.json({
      success: true,
      data: {
        ...user,
        linkedEmployee: linkedEmployee
          ? {
              id: linkedEmployee.id,
              employeeId: linkedEmployee.employeeId,
              name: linkedEmployee.name,
              department: linkedEmployee.department,
              position: linkedEmployee.position,
              joiningDate: linkedEmployee.joiningDate,
            }
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user info",
    });
  }
};

// ---------------- UPDATE PROFILE ----------------
exports.updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// ---------------- CHANGE PASSWORD ----------------
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// ---------------- DELETE CURRENT USER ----------------
exports.deleteMe = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USR_404",
          message: "User not found",
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "USR_500",
        message: "Internal server error",
        details: error.message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
};

// -------------------- REFRESH TOKEN --------------------
// exports.refreshToken = async (req, res) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;  // ✅ get from cookie

//     if (!refreshToken) {
//       return res.status(401).json({ message: "Refresh token required" });
//     }

//     const user = await prisma.user.findFirst({
//       where: { refreshToken }
//     });

//     if (!user) {
//       return res.status(403).json({ message: "Invalid refresh token" });
//     }

//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

//     const newAccessToken = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "15m" }
//     );

//     // update cookie
//     res.cookie("accessToken", newAccessToken, {
//       httpOnly: true,
//       sameSite: "lax"
//     });

//     return res.json({ message: "Token refreshed" });

//   } catch (error) {
//     return res.status(403).json({ message: "Refresh token expired" });
//   }
// };

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const user = await prisma.user.findFirst({
      where: { refreshToken }
    });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_Expiry || "7d" }
    );

    // Update cookie with same settings as login
    // const cookieOptions = {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   path: '/'
    // };

     const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite:  "none",
      path: '/',
      maxAge:15*60*1000
    };

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000
    });

    // Also return token in response for frontend that might need it
    return res.json({ 
      message: "Token refreshed",
      accessToken: newAccessToken // Optional: send in response too
    });

  } catch (error) {
    return res.status(403).json({ message: "Refresh token expired" });
  }
};

// -------------------- LOGOUT --------------------


// exports.logout = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(400).json({ message: "Access token required" });
//     }

//     const accessToken = authHeader.split(" ")[1];

//     // Decode to get expiry
//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

//     // Add token to blacklist
//     await prisma.blacklistedToken.create({
//       data: {
//         token: accessToken,
//         expiresAt: new Date(decoded.exp * 1000),
//       },
//     });

//     // Remove refresh token from user
//     await prisma.user.update({
//       where: { id: decoded.id },
//       data: { refreshToken: null },
//     });

//     return res.json({ message: "Logged out successfully" });

//   } catch (error) {
//     return res.status(400).json({ message: "Invalid token" });
//   }
// };

// exports.logout = async (req, res) => {
//   try {
//     const accessToken = req.cookies.accessToken;
//     //const refreshToken = req.cookies.refreshToken;
 
//     if (!accessToken) {
//       return res.status(400).json({ message: "Access token missing" });
//     }
 
//     // Decode access token
//     //const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
//     // ✅ Fix — use decode, it never throws on expiry
// const decoded = jwt.decode(accessToken);
 
// if (!decoded) {
//   return res.status(400).json({ message: "Invalid token" });
// }
 
//     // Blacklist access token
//     await prisma.blacklistedToken.create({
//       data: {
//         token: accessToken,
//         expiresAt: new Date(decoded.exp * 1000),
//       },
//     });
 
//     // Remove refresh token from DB
//     await prisma.user.update({
//       where: { id: decoded.id },
//       data: { refreshToken: null },
//     });
 
//     // 🔥 CLEAR COOKIES
//     // res.clearCookie("accessToken");
//     // res.clearCookie("refreshToken");
//     // ✅ Fix
// const clearOptions = { httpOnly: true, secure: true, sameSite: "none", path: "/" };
// res.clearCookie("accessToken", clearOptions);
// res.clearCookie("refreshToken", clearOptions);
 
//     return res.json({ message: "Logged out successfully" });
 
//   } catch (error) {
//     return res.status(400).json({ message: "Invalid token" });
//   }
// };

exports.logout = async (req, res) => {
  try {
    let accessToken = req.cookies?.accessToken;
    if (!accessToken && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      accessToken = req.headers.authorization.split(" ")[1];
    }

    // ✅ decode instead of verify — works even on expired tokens
    const decoded = accessToken ? jwt.decode(accessToken) : null;

    if (decoded) {
      try {
        await prisma.blacklistedToken.create({
          data: {
            token: accessToken,
            expiresAt: new Date(decoded.exp * 1000),
          },
        });
      } catch (e) {
        // Already blacklisted — ignore duplicate error
      }

      await prisma.user.update({
        where: { id: decoded.id },
        data: { refreshToken: null },
      });
    }

    // ✅ clearCookie must match the same options used when setting
    const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";
    const clearOptions = {
      httpOnly: true,
      secure: isHttps,
      sameSite: isHttps ? "none" : "lax",
      path: "/",
    };
    res.clearCookie("accessToken", clearOptions);
    res.clearCookie("refreshToken", clearOptions);

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Logout failed" });
  }
};