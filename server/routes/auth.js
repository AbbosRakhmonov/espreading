const express = require("express");
const router = express.Router();
const { getMe, login, logout, register } = require("../controllers/auth");
const { protect } = require("../middleware/auth");

router.get("/me", protect, getMe);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", protect, logout);

module.exports = router;
