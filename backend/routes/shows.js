
import express from "express";
import show from "../models/Show.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.movie) filter.movie = req.query.movie;
  if (req.query.date) {
    const start = new Date(req.query.date);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    filter.startTime = { $gte: start, $lt: end };
  }

  const shows = await Show.find(filter).populate("movie").sort({ startTime: 1 });
  res.json(shows);
});

router.get("/:id", async (req, res) => {
  const show = await Show.findById(req.params.id).populate("movie");
  if (!show) return res.status(404).json({ message: "Show not found" });
  res.json(show);
});


export default router;