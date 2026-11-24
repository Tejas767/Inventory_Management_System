

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: (process.env.PORT) === 587, // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial;">
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `,
  });
};
    
