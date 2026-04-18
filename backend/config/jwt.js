module.exports = {
    jwtSecret: process.env.JWT_SECRET || "supersecretkey",
    jwtExpire: "7d"
};
