import express from "express";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { search = "", genre = "" } = req.query;
  const query = { isActive: true };
  if (genre) query.genre = genre;
  if (search) query.title = { $regex: search, $options: "i" };

  const movies = await Movie.find(query).sort({ releaseDate: -1 });
  res.json(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  const shows = await Show.find({ movie: movie._id, startTime: { $gte: new Date() } }).sort({ startTime: 1 });
  res.json({ movie, shows });
});


export default router;
