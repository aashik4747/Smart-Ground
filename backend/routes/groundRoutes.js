const router = require("express").Router();
const { searchGrounds, getGroundById, seedGrounds } = require("../controllers/groundController");

router.get("/seed", seedGrounds);
router.get("/search", searchGrounds);
router.get("/:id", getGroundById);

module.exports = router;
