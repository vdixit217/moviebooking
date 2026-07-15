import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    seats: [
      {
        seatNumber: String,
        row: String,
        column: Number,
        type: String,
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    convenienceFee: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
    bookingId: { type: String, unique: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'paid' },
  },
  { timestamps: true }
);

// Generate booking ID before save
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);