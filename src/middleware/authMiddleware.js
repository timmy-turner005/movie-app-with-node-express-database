import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

// read token from request and check if it's valid
const authMiddleware = async (req, res, next) => {
  console.log("authMiddleware called");

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Get token from header
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    // Get token from cookie
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    // Verify token and extract userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ error: "Not authorized, user not found" });
    }

    req.user = user;
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, token invalid" });
  }

  next();
};

export default authMiddleware;
