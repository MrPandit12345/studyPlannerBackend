import { Context } from "hono";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Auth from "models/user.model"

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY!;

// 🧾 REGISTER
export const registerUser = async (c: Context) => {
  try {
    const { name, email, password, confirmPassword } = await c.req.json();

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return c.json({ message: "All fields are required" }, 400);
    }

    if (password !== confirmPassword) {
      return c.json({ message: "Passwords do not match" }, 400);
    }

    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return c.json({ message: "User already exists" }, 400);
    }


    const passwordHash = await bcrypt.hash(password, 10);


    const newUser = await Auth.create({ name, email, passwordHash });


    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, name: newUser.name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return c.json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};

export const loginUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ message: "Email and password are required" }, 400);
    }

    const user = await Auth.findOne({ email });
    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return c.json({ message: "Invalid password" }, 401);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return c.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};


export const getUserProfile = (c: Context) => {
  const user = c.get("user");
  return c.json({ message: "Access granted", user });
};
