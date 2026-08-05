import { z } from "zod";

const addToWatchlistSchema = z.object({
  movieId: z.string().uuid("Movie ID must be a valid UUID"),
  status: z
    .enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
      error: () => ({
        message:
          "Invalid status. Must be one of: PLANNED, WATCHING, COMPLETED, DROPPED",
      }),
    })
    .optional(),
  rating: z.coerce
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 10")
    .max(10, "Rating must be between 1 and 10")
    .optional(),
  notes: z.string().optional(),
});

export { addToWatchlistSchema };
