const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const { validateStall } = require("../middlewares/validateStall");
const { checkValidation } = require("../middlewares/validate");
const { createStall, getAllStallsAdmin } = require("../controllers/stallController");

router.post("/", auth, role("stallOwner"), validateStall, checkValidation, createStall);
router.get("/admin/all", auth, role("admin"), getAllStallsAdmin);

module.exports = router;
