const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const register = async (req, res) => {
  try {
    const { username, email, password, gender, birthDate } = req.body;

    if (!password || !gender || !birthDate || (!username && !email)) {
      return res.status(400).json({
        message:
          "username or email, password, gender, and birthDate are required",
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!["male", "female"].includes(gender)) {
      return res.status(400).json({ message: "gender must be male or female" });
    }

    const parsedBirthDate = new Date(birthDate);
    if (Number.isNaN(parsedBirthDate.getTime())) {
      return res.status(400).json({ message: "Invalid birthDate value" });
    }

    if (username) {
      const existingByUsername = await User.findOne({ username });
      if (existingByUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    if (email) {
      const existingByEmail = await User.findOne({
        email: String(email).toLowerCase(),
      });
      if (existingByEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username || undefined,
      email: email ? String(email).toLowerCase() : undefined,
      password: hashedPassword,
      gender,
      birthDate: parsedBirthDate,
    });

    const token = createToken(user._id.toString());

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ message: "username or email and password are required" });
    }

    const query = email
      ? { email: String(email).toLowerCase() }
      : { username: String(username) };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id.toString());

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getSession,
};
