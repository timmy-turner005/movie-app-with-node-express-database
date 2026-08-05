import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Please define it in your .env file.",
  );
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const creatorId = "9bec15fd-a1f1-4a52-afa2-bdd0e5bc60b7"; // Replace with the actual creatorId you want to use

const movies = [
  {
    title: "The Shawshank Redemption",
    overview:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1999,
    genres: ["Drama", "Crime"],
    runtime: 142,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Godfather",
    overview:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseYear: 1972,
    genres: ["Drama", "Crime", "Thriller"],
    runtime: 175,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7en6Qli9tN4BVKWI.jpg",
    createdBy: creatorId,
  },
  {
   title: "The Legend of 1900",
    overview:
      "A man who was born on an ocean liner and spent his entire life on board, becomes a legendary pianist.",
    releaseYear: 1998,
    genres: ["Drama", "Music"],
    runtime: 152,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/6I2tW6WMUDux911r6m7haRef0WH.jpg",
    createdBy: creatorId,
  },
  {
    title: "Pulp Fiction",
    overview:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    genres: ["Crime", "Drama"],
    runtime: 154,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0y0d9IXJEpO6cZi1E6.jpg",
    createdBy: creatorId,
  },
  {
    title: "Forrest Gump",
    overview:
      "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.",
    releaseYear: 1994,
    genres: ["Drama", "Romance"],
    runtime: 142,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/6hB99ibD6fP757F6q8eGt2Qp36K.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Matrix",
    overview:
      "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
    releaseYear: 1999,
    genres: ["Action", "Sci-Fi"],
    runtime: 136,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/f89U3ADr1y694gLIpD70H0pZMmR.jpg",
    createdBy: creatorId,
  },
  {
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    runtime: 148,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/9GtvJk536797438926F1V4dL7Dp.jpg",
    createdBy: creatorId,
  },
  {
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    posterUrl: "https://image.tmdb.org/t/p/w500/gCZb427738899356412375869.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    overview:
      "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    releaseYear: 2001,
    genres: ["Adventure", "Drama", "Fantasy"],
    runtime: 178,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/6I2tW6WMUDux911r6m7haRef0WH.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Dark Knight",
    overview:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseYear: 2008,
    genres: ["Action", "Crime", "Drama"],
    runtime: 152,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    createdBy: creatorId,
  },
];

const main = async () => {
  console.log("Seeding movies...");

  for (const movie of movies) {
    const existingMovie = await prisma.movie.findFirst({
      where: { title: movie.title },
    });

    if (existingMovie) {
      console.log(`Movie "${movie.title}" already exists. Skipping.`);
      continue;
    }

    await prisma.movie.create({
      data: movie,
    });
    console.log(`Movie "${movie.title}" created successfully.`);
  }

  console.log("All movies seeded successfully.");
};

main()
  .catch((error) => {
    console.error("Error seeding movies:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
