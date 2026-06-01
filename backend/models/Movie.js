import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    genre: [{ type: String, required: true }],
    language: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    rating: { type: String, enum: ['U', 'UA', 'A', 'S'], default: 'UA' },
    imdbRating: { type: Number, min: 0, max: 10 },
    releaseDate: { type: Date, required: true },
    poster: { type: String, default: '' },
    trailer: { type: String, default: '' },
    cast: [{ name: String, role: String, photo: String }],
    director: { type: String },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

movieSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Movie', movieSchema);