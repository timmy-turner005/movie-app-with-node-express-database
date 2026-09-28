import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  //check if user already exists
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  // hash the password
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  //Generate a token (for example, using JWT) and send it in the response
  const token = generateToken(user.id, res); // Assuming you have a function to generate a token

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
      token: token, // Include the generated token in the response
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Check if the password is correct
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  //verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate a token (for example, using JWT) and send it in the response
  const token = generateToken(user.id, res); // Assuming you have a function to generate a token

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
      token: token, // Include the generated token in the response
    },
  });
};

const logout = async (req, res) => {
  // Clear the JWT cookie
//   res.clearCookie('jwt');
res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Set the cookie to expire in the past
  });

  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};

export { register, login, logout };
