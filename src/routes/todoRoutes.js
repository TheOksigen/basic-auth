const express = require("express");
const {
  getTodo,
  sendTodo,
  updateTodo,
} = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/getTodo", authMiddleware, getTodo);
router.post("/sendTodo", authMiddleware, sendTodo);
router.patch("/updateTodo/:id", authMiddleware, updateTodo);
router.patch("/updateTodo", authMiddleware, updateTodo);

module.exports = router;
