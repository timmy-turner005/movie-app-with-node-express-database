import { prisma } from "../config/db.js";

const addToWatchlist = async (req, res) => {
  const userId = req.user?.id;
  const { movieId, status, rating, notes } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Not authorized" });
  }

  //verify movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // Check if already added to watchlist
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
  });

  if (existingInWatchlist) {
    return res.status(400).json({ error: "Movie already in watchlist" });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId,
      movieId,
      status: status || "PLANNED", // Default to "PLANNED" if not provided
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      watchlistItem,
    },
  });
};

const removeFromWatchlist = async (req, res) => {
  const movieId = req.params.movieId || req.body.movieId;
  const currentUserId = req.user?.id;

  if (!movieId) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  if (!currentUserId) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: currentUserId,
        movieId,
      },
    },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  const deletedItem = await prisma.watchlistItem.delete({
    where: {
      userId_movieId: {
        userId: currentUserId,
        movieId,
      },
    },
  });

  res.status(200).json({
    status: "success",
    message: "Watchlist item removed successfully",
    data: {
      watchlistItem: deletedItem,
    },
  });
};

const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;
  const movieId = req.params.movieId;
  const currentUserId = req.user?.id;

  if (!movieId) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  if (!currentUserId) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: currentUserId,
        movieId,
      },
    },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  const updatedData = {};
  if (status !== undefined && status !== null) updatedData.status = status;
  if (rating !== undefined && rating !== null) updatedData.rating = rating;
  if (notes !== undefined && notes !== null) updatedData.notes = notes;

  const updatedItem = await prisma.watchlistItem.update({
    where: {
      userId_movieId: {
        userId: currentUserId,
        movieId,
      },
    },
    data: {
      status,
      rating,
      notes,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      watchlistItem: updatedItem,
    },
  });
};

export { addToWatchlist, removeFromWatchlist, updateWatchlistItem };
