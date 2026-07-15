import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/auth.js";
import show from "../models/Show.js";

const router = express.Router();

router.get("/mine", protect, async (req, res) => {
    const bookings = await Booking.find({user: req.user._id})
     .populate("movie")
     .populate("show")
     .sort({ createdAt: -1 });
    res.json(bookings);
});

router.post("/", protect, async (req, res) => {
    try {
        const { showId , seats } = req.body;
        if(!Array.isArray(seats) || seats.length === 0){
            return res.status(400).json({ message: "Select at least one seat" });
        }
        const show = await show.findById(showId);
        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }
        const alreadyBookedSeats = seats.filter((seat) => show.bookedSeats.includes(seat));
        if (alreadyBookedSeats.length > 0) {
            return res.status(400).json({ message: `Seats unavailable: ${alreadyBookedSeats.join(",")}` });
        }

        show.bookedSeats.push(...seats);
        await show.save();

        const booking = await Booking.create({
            user: req.user._id,
            movie: show.movie._id,
            show: show._id,
            seats,
            amount: seats.length * show.price,
           
        });

        res.status(201).json(await booking.populate(["movie", "show"]));
    } catch (error) {

        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//cancel booking 

router.patch("/:id/cancel", async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status === "cancelled") return res.json(booking);

  booking.status = "cancelled";
  await booking.save();
  await Show.findByIdAndUpdate(booking.show, { $pull: { bookedSeats: { $in: booking.seats } } });
  res.json(booking);
});

export default router;




