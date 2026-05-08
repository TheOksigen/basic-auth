const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const dataDirPath = path.join(__dirname, "..", "..", "data");
const usersFilePath = path.join(dataDirPath, "users.json");

const readUsers = async () => {
  try {
    const fileContent = await fs.readFile(usersFilePath, "utf8");
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(dataDirPath, { recursive: true });
      await fs.writeFile(usersFilePath, "[]", "utf8");
      return [];
    }

    throw error;
  }
};

const writeUsers = async (users) => {
  await fs.mkdir(dataDirPath, { recursive: true });
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf8");
};

const normalizeValue = (value) => (value instanceof Date ? value.toISOString() : value);

const matchQuery = (user, query) =>
  Object.entries(query).every(([key, value]) => user[key] === normalizeValue(value));

class User {
  static async findOne(query) {
    const users = await readUsers();
    return users.find((user) => matchQuery(user, query)) || null;
  }

  static async create(userData) {
    const users = await readUsers();
    const now = new Date().toISOString();

    const nextUser = {
      _id: randomUUID(),
      username: userData.username || null,
      email: userData.email || null,
      password: userData.password,
      gender: userData.gender,
      birthDate: normalizeValue(userData.birthDate),
      createdAt: now,
      updatedAt: now,
      __v: 0,
    };

    users.push(nextUser);
    await writeUsers(users);

    return nextUser;
  }

  static findById(userId) {
    return {
      select: async (projection) => {
        const users = await readUsers();
        const user = users.find((item) => item._id === userId);

        if (!user) {
          return null;
        }

        if (projection === "-password") {
          const { password, ...safeUser } = user;
          return safeUser;
        }

        return user;
      },
    };
  }
}

module.exports = User;
