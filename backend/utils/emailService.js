const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // App password (not your Gmail password)
  },
  tls: {
    rejectUnauthorized: false, // Prevents SSL issues
  }
});

// Function to send verification email
exports.sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: `"Privacy Loan App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - Privacy Loan App",
    text: `Your verification code is: ${verificationCode}\n\nThis code will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return { success: true, message: "Verification email sent" };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  }
};
