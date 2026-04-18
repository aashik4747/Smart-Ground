const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
    createMatch,
    joinMatch,
    getAllMatches,
    getMyMatches,
    getMatchDetails,
    leaveMatch,
    cancelMatch
} = require("../controllers/matchController");

router.get("/", auth, getAllMatches);
router.get("/my-matches", auth, getMyMatches);
router.get("/:id", auth, getMatchDetails);
router.post("/", auth, createMatch);
router.post("/:id/join", auth, joinMatch);
router.post("/:id/leave", auth, leaveMatch);
router.delete("/:id", auth, cancelMatch);

module.exports = router;
