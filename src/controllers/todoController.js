const Todo = require("../models/Todo");

const getTodo = async (req, res) => {
  try {
    const todos = await Todo.findByUserId(req.user.userId);
    return res.json({ todos });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const sendTodo = async (req, res) => {
  try {
    const { title, checked } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    if (checked !== undefined && typeof checked !== "boolean") {
      return res.status(400).json({ message: "checked must be boolean" });
    }

    const todo = await Todo.create({
      userId: req.user.userId,
      title: title.trim(),
      checked: checked ?? false,
    });

    return res.status(201).json({ todo });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id || req.body.id;
    const { title, checked } = req.body;
    const todoData = {};

    if (!todoId) {
      return res.status(400).json({ message: "todo id is required" });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "title must be a non-empty string" });
      }

      todoData.title = title.trim();
    }

    if (checked !== undefined) {
      if (typeof checked !== "boolean") {
        return res.status(400).json({ message: "checked must be boolean" });
      }

      todoData.checked = checked;
    }

    if (!Object.keys(todoData).length) {
      return res.status(400).json({ message: "title or checked is required" });
    }

    const todo = await Todo.updateByIdAndUserId(todoId, req.user.userId, todoData);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    return res.json({ todo });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTodo,
  sendTodo,
  updateTodo,
};
