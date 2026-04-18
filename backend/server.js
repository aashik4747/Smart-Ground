require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
connectDB();

app.use(helmet());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:52609", "http://127.0.0.1:52609", "http://127.0.0.1:51689"],
    credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Prevent HTTP Parameter Pollution
app.use(hpp());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per 15 mins (increased for development)
    message: "Too many requests from this IP, please try again later",
    skip: (req) => true, // Skip rate limiting in development
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", apiLimiter);
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/venues", require("./routes/venueRoutes"));
app.use("/api/grounds", require("./routes/groundRoutes"));
app.use("/api/stalls", require("./routes/stallRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
// Mount admin routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Root route for checks
app.get('/', (req, res) => res.send('API Running'));

// Debug endpoint to capture frontend errors (development only)
if (process.env.NODE_ENV !== "production") {
    app.post('/api/debug/log', (req, res) => {
        console.error("FRONTEND ERROR:", req.body);
        res.sendStatus(200);
    });
}

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === "production"
            ? process.env.FRONTEND_URL
            : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:52609", "http://127.0.0.1:52609", "http://127.0.0.1:51689"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        socket.join(data);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});
