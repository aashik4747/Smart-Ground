const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const {
    getProfile,
    getAllUsers,
    updateProfile,
    updateUserStatus,
    setInitialRole,
    followUser,
    unfollowUser,
    getDiscoverablePlayers
} = require("../controllers/userController");

const upload = require("../middlewares/uploadMiddleware");

router.post("/role", auth, setInitialRole);
router.get("/me", auth, getProfile);
router.put("/me", auth, (req, res, next) => {
    upload.single("profileImage")(req, res, (err) => {
        if (err) {
            console.error("Multer Error:", err);
            return res.status(400).json({ message: err.message || err });
        }
        next();
    });
}, updateProfile);

router.get("/discover", auth, getDiscoverablePlayers);
router.post("/:id/follow", auth, followUser);
router.post("/:id/unfollow", auth, unfollowUser);

router.get("/", auth, role("admin"), getAllUsers);
router.put("/:id/status", auth, role("admin"), updateUserStatus);

module.exports = router;
