const express = require("express");
const {
  register,
  login,
  getSession,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getSession", authMiddleware, getSession);

module.exports = router;
