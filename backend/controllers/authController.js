const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/jwt");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require('google-auth-library');

const sendEmail = require("../utils/sendEmail");

// Helper function to hash OTP
const hashOTP = async (otp) => {
    return await bcrypt.hash(otp.toString(), 10);
};

// Helper function to verify OTP
const verifyOTP = async (plainOTP, hashedOTP) => {
    return await bcrypt.compare(plainOTP.toString(), hashedOTP);
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE');

// Initialize Forgot Password Node Process natively
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No user found with this email" });
        }

        // Generate a 6-digit Reset OTP correctly cleanly avoiding complex jwt tokens natively
        const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = await hashOTP(resetOtp);
        user.otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Send Email smoothly
        await sendEmail(email, "Password Reset Request", `Your password reset code is: ${resetOtp}. Please use it to reset your password.`);

        res.json({ success: true, message: "Reset link sent to your email!" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Enforce 'pending' default role on registration regardless of frontend payload
        const normalizedRole = "pending";

        // Validate role input
        const validRoles = ["user", "manager", "admin"];
        if (!validRoles.includes(normalizedRole)) {
            return res.status(400).json({ message: "Invalid role selected. Valid roles: user, manager, admin" });
        }

        // Admin Secret Validation
        if (normalizedRole === "admin") {
            const adminSecret = process.env.ADMIN_SECRET_KEY;
            if (req.body.adminSecret !== adminSecret) {
                return res.status(403).json({ message: "Invalid Admin Secret Key" });
            }
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        const hashedOTP = await hashOTP(otp);

        const user = await User.create({
            name,
            email,
            password,
            role: normalizedRole,
            otp: hashedOTP,
            otpExpires
        });

        // Send OTP Email
        await sendEmail(email, "Your Verification OTP", `Your OTP for account verification is: ${otp}`);

        res.status(201).json({ success: true, message: "User registered successfully. details sent to email", user: { email: user.email, name: user.name } });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server Error during registration", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.status === 'banned') {
            return res.status(403).json({ message: "Your account has been banned. Please contact support." });
        }
        
        if (user.status === 'suspended') {
            return res.status(403).json({ message: "Your account is suspended. Please contact support." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.role === "pending") {
            if (user.otp) {
                return res.status(200).json({ requiresOTP: true, message: "Please verify your account", email: user.email });
            } else {
                // Recover corrupted pending accounts missing their OTP
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                user.otp = await hashOTP(otp);
                user.otpExpires = Date.now() + 10 * 60 * 1000;
                await user.save();
                await sendEmail(user.email, "Your Verification OTP", `Your OTP for account verification is: ${otp}`);
                return res.status(200).json({ requiresOTP: true, message: "Please verify your account", email: user.email });
            }
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: jwtExpire }
        );

        // Set HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({ success: true, user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error during login" });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.status === 'banned') {
            return res.status(403).json({ message: "Your account has been banned. Please contact support." });
        }
        
        if (user.status === 'suspended') {
            return res.status(403).json({ message: "Your account is suspended. Please contact support." });
        }

        const isOTPValid = await verifyOTP(otp, user.otp);
        if (!isOTPValid || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP 
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate Token (Auto Login)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: jwtExpire }
        );

        // Set HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({ success: true, message: "OTP Verified Successfully", user });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: "Server Error during OTP verification" });
    }
};

// Logout
exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    res.json({ success: true, message: 'Logged out successfully' });
};

// Google Auth
exports.googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        
        // For local development with placeholder client ID, we'll bypass real verification
        // IN PRODUCTION: Ensure you have GOOGLE_CLIENT_ID set in .env
        let email, name, picture;

        if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'YOUR_CLIENT_ID_HERE') {
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
        } else {
            // Mock payload for demonstration purposes when Client ID is missing
            email = `googleuser_${Math.floor(Math.random() * 1000)}@gmail.com`;
            name = "Google User (Demo)";
        }

        let user = await User.findOne({ email });

        if (user) {
            if (user.status === 'banned') {
                return res.status(403).json({ message: "Your account has been banned. Please contact support." });
            }
            if (user.status === 'suspended') {
                return res.status(403).json({ message: "Your account is suspended. Please contact support." });
            }
        }

        if (!user) {
            // Create the new user with a random un-guessable password
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            
            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
            const hashedOTP = await hashOTP(otp);

            user = await User.create({
                name,
                email,
                password: randomPassword,
                role: "pending",
                profileImage: picture,
                otp: hashedOTP,
                otpExpires
            });

            // Send OTP Email
            await sendEmail(email, "Your Verification OTP", `Your OTP for account verification is: ${otp}`);

            return res.json({ success: true, requiresOTP: true, message: "OTP sent for verification", email: user.email });
        }

        if (user.role === "pending") {
            if (user.otp) {
                return res.json({ success: true, requiresOTP: true, message: "Please verify your account", email: user.email });
            } else {
                // Recover corrupted pending accounts missing their OTP
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                user.otp = await hashOTP(otp);
                user.otpExpires = Date.now() + 10 * 60 * 1000;
                await user.save();
                await sendEmail(user.email, "Your Verification OTP", `Your OTP for account verification is: ${otp}`);
                return res.json({ success: true, requiresOTP: true, message: "Please verify your account", email: user.email });
            }
        }

        // Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: jwtExpire }
        );

        // Set HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({ success: true, message: "Google Authentication Successful", user });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Google Authentication Failed" });
    }
};

// Update Turf ID
exports.updateTurfId = async (req, res) => {
    try {
        const { turfId } = req.body;
        // From our JWT middleware, we don't have this route protected yet, let's assume we do via headers, 
        // Or wait, do we have a verifyToken middleware? Let's assume we do.
        // I will add verifyToken logic here to be safe and standalone if needed, but usually it's in authRoutes.
        // Actually, the user object will come from auth token
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.token;
        let token = cookieToken;
        if (!token && authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized to update Turf ID" });
        }

        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.id;

        if (!turfId) {
            return res.status(400).json({ message: "Turf ID is required" });
        }

        // check if taken
        const existing = await User.findOne({ turfId });
        if (existing && existing._id.toString() !== userId.toString()) {
            return res.status(400).json({ message: "Username already taken. try different username..." });
        }

        const user = await User.findById(userId);
        if (!user) {
             return res.status(404).json({ message: "User not found" });
        }

        // Check again with final turfId
        const existingFinal = await User.findOne({ turfId: turfId });
        if (existingFinal && existingFinal._id.toString() !== userId.toString()) {
            return res.status(400).json({ message: "Username already taken. try different username..." });
        }

        user.turfId = turfId;
        await user.save();

        res.json({ success: true, message: "Turf ID updated successfully", user });
    } catch (error) {
        console.error("Update Turf ID Error:", error);
        res.status(500).json({ message: "Server Error during Turf ID update", error: error.message });
    }
};
