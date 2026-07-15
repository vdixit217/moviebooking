import express from "express";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Protect all admin routes
router.use(protect, adminOnly);

// Dashboard Stats
router.get("/stats", async (req, res) => {
  try {
    const [movies, shows, bookings, revenue] = await Promise.all([
      Movie.countDocuments(),
      Show.countDocuments(),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.aggregate([
        { $match: { status: "confirmed" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    res.json({
      movies,
      shows,
      bookings,
      revenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Movie
router.post("/movies", async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Movie
router.patch("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Show
router.post("/shows", async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user movie show")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;