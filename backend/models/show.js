import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true }, // e.g. A1, B5
  row: { type: String, required: true },
  column: { type: Number, required: true },
  type: { type: String, enum: ['standard', 'premium', 'vip'], default: 'standard' },
  price: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: String, required: true },
    screen: { type: String, required: true },
    showDate: { type: Date, required: true },
    showTime: { type: String, required: true }, // e.g. "10:30 AM"
    seats: [seatSchema],
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Helper to generate seats for a screen
showSchema.statics.generateSeats = function (rows, cols, pricing) {
  const seats = [];
  const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const row = rowLetters[r];
      let type = 'standard';
      let price = pricing.standard;
      if (r < 2) { type = 'vip'; price = pricing.vip; }
      else if (r < 5) { type = 'premium'; price = pricing.premium; }
      seats.push({ seatNumber: `${row}${c}`, row, column: c, type, price, isBooked: false });
    }
  }
  return seats;
};

export default mongoose.model('Show', showSchema);