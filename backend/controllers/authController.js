import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import passport from "../config/passport.js";
// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields!");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// @desc login  user
// @route POST /api/auth/login

// @access Public
const loginUser = async (req, res) => {
  console.log("req.body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields!");
  }
  console.log(email, password);
  try {
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Server error");
  }
};

// @desc Get current  logged-in  user
// @route POST /api/auth/me

// @access Private

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      businessName: user.businessName || "",
      address: user.address || "",
      phone: user.phone || "",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error");
  }
};

// @desc Update user profile
// @route POST /api/auth/update

// @access Private

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.businessName = req.body.businessName || user.businessName;
      user.address = req.body.address || user.address;
      user.phone = req.body.phone || user.phone;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        businessName: updatedUser.businessName || "",
        address: updatedUser.address || "",
        phone: updatedUser.phone || "",
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Server error");
  }
};

// @desc   Forgot password — send reset email
// @route  POST /api/auth/forgot-password
// @access Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Always return same message to prevent email enumeration attacks
  if (!user) {
    return res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent." });
  }

  // Block Google-only accounts
  if (user.authProvider === "google" && !user.password) {
    return res.status(400).json({
      message: "This account uses Google login. Please sign in with Google.",
    });
  }

  const rawToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 24px;">
      <h2 style="color: #1e40af;">Reset Your Password</h2>
      <p>You requested a password reset for your Invoice Copilot account.</p>
      <p>Click the button below — this link expires in <strong>15 minutes</strong>.</p>
      <a href="${resetUrl}"
         style="display:inline-block; padding:12px 24px; background:#2563eb; color:white;
                border-radius:8px; text-decoration:none; font-weight:600; margin:16px 0;">
        Reset Password
      </a>
      <p style="color:#888; font-size:13px; margin-top:24px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset — Invoice Copilot",
      html,
    });
    res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    // Clean up so user can try again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res
      .status(500)
      .json({ message: "Email could not be sent. Please try again." });
  }
};

// @desc   Reset password using token from email
// @route  PUT /api/auth/reset-password/:token
// @access Public
const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }, // not expired
  }).select("+resetPasswordToken +resetPasswordExpire");

  if (!user) {
    return res
      .status(400)
      .json({ message: "Reset link is invalid or has expired." });
  }

  user.password = req.body.password; // pre-save hook hashes it
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({
    message: "Password reset successful.",
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
  });
};

// @route GET /api/auth/google
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

// @route GET /api/auth/google/callback
const googleCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
      );
    }

    const token = generateToken(user._id);

    // Send token + user data back to frontend via URL params
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&id=${user._id}`,
    );
  })(req, res);
};

export {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
};
