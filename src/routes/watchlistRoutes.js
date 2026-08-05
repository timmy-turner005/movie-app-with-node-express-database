import express from "express";
import {
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
} from "../controllers/watchlistController.js";
import { login, logout } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware); // Apply the authMiddleware to all routes in this router

router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist);

router.put("/:movieId", updateWatchlistItem); // Assuming you want to update the watchlist item with the same function

router.delete("/:movieId", removeFromWatchlist);

router.post("/login", login);
router.post("/logout", logout); // Assuming you have a logout function in your authController.js

export default router;
