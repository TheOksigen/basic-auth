const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const dataDirPath = path.join(__dirname, "..", "..", "data");
const todosFilePath = path.join(dataDirPath, "todos.json");

const readTodos = async () => {
  try {
    const fileContent = await fs.readFile(todosFilePath, "utf8");
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(dataDirPath, { recursive: true });
      await fs.writeFile(todosFilePath, "[]", "utf8");
      return [];
    }

    throw error;
  }
};

const writeTodos = async (todos) => {
  await fs.mkdir(dataDirPath, { recursive: true });
  await fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), "utf8");
};

class Todo {
  static async findByUserId(userId) {
    const todos = await readTodos();
    return todos.filter((todo) => todo.userId === userId);
  }

  static async create({ userId, title, checked = false }) {
    const todos = await readTodos();
    const now = new Date().toISOString();

    const nextTodo = {
      _id: randomUUID(),
      userId,
      title,
      checked,
      createdAt: now,
      updatedAt: now,
      __v: 0,
    };

    todos.push(nextTodo);
    await writeTodos(todos);

    return nextTodo;
  }

  static async updateByIdAndUserId(todoId, userId, todoData) {
    const todos = await readTodos();
    const todoIndex = todos.findIndex(
      (todo) => todo._id === todoId && todo.userId === userId,
    );

    if (todoIndex === -1) {
      return null;
    }

    const updatedTodo = {
      ...todos[todoIndex],
      ...todoData,
      updatedAt: new Date().toISOString(),
    };

    todos[todoIndex] = updatedTodo;
    await writeTodos(todos);

    return updatedTodo;
  }
}

module.exports = Todo;
