import { Link } from "react-router-dom";
import { CalendarDays, Clapperboard, TicketCheck } from "lucide-react";
import "./Home.css";

export default function Home() {
  return (
    <main className="home">
      <section className="home-hero">
        <img src="/cinema-lobby.png" alt="Premium cinema lobby" />
        <div className="home-shade"></div>
        <div className="home-copy">
          <p className="eyebrow">Silverline Cinema</p>
          <h1>Book the best seats before the trailers begin.</h1>
          <p>Browse movies, compare showtimes, pick seats, and keep every ticket in one account.</p>
          <div className="home-actions">
            <Link className="button" to="/movies">Explore movies</Link>
            <Link className="button secondary" to="/my-bookings">My tickets</Link>
          </div>
        </div>
      </section>
      <section className="page feature-row">
        <article className="card feature"><Clapperboard /><h3>Curated movies</h3><p>Organized listings with genre, rating, runtime, and release details.</p></article>
        <article className="card feature"><CalendarDays /><h3>Live showtimes</h3><p>Choose from upcoming screenings with theater, screen, and format metadata.</p></article>
        <article className="card feature"><TicketCheck /><h3>Seat booking</h3><p>Prevent duplicate bookings with server-side booked-seat validation.</p></article>
      </section>
    </main>
  );
}
