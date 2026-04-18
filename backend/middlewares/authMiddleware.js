const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt");

module.exports = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        req.user = jwt.verify(token, jwtSecret);
        next();
    } catch {
        res.status(401).json({ msg: "Invalid token" });
    }
};
