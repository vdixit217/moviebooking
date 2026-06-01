import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import showRoutes from "./routes/shows.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";


dotenv.config();

const app = express();

//Middleware 
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your frontend URL
    credentials: true,

})
);

app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Cineplex API running",
  });
});

const PORT = process.env.PORT || 5000;

try{
    await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

}catch(error){
    console.error("Error connecting to MongoDB:", error);

}

export default app;
