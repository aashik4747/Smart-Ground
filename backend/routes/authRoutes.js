const router = require("express").Router();
const { register, login, verifyOTP, forgotPassword, logout, googleAuth, updateTurfId } = require("../controllers/authController");
const { validateRegister, validateLogin, checkValidation } = require("../middlewares/validateAuth");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25, // Relaxed limit for easier development testing
    message: "Too many authentication attempts originating from this IP, please try again after 15 minutes",
});

router.post("/register", authLimiter, validateRegister, checkValidation, register);
router.post("/login", authLimiter, validateLogin, checkValidation, login);
router.post("/google", authLimiter, googleAuth);
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/logout", logout);
router.put("/turfid", authLimiter, updateTurfId);

module.exports = router;
