const nodemailer = require("nodemailer");
require("dotenv").config();


// Setting transporter for gmail credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Sending OTP function
const SendOTP = async (email, OTP) => {
  try {
    const MailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Inventory Manager OTP",
      text: `Your OTP is ${OTP}. It will expire in 1 minute.`,
    };
    await transporter.sendMail(MailOptions);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};

module.exports = SendOTP;
