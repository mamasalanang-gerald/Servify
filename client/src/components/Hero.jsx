import { useState } from "react";
import "./Hero.css";

export default function Hero() {
  const [query, setQuery] = useState("");

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Book Trusted Services<br />
          <span className="hero-accent">Anytime, Anywhere</span>
        </h1>
        <p className="hero-subtitle">
          Connect with verified professionals for home services, repairs, beauty, tutoring, and
          more. Quality service at your fingertips.
        </p>

        <div className="hero-search">
          <input
            type="text"
            placeholder="Search for services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            Search
          </button>
        </div>

        <div className="hero-badges">
          <div className="badge">
            <svg width="18" height="18" fill="none" stroke="#2c3fd1" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Verified Providers
          </div>
          <div className="badge">
            <svg width="18" height="18" fill="none" stroke="#2c3fd1" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Payments
          </div>
          <div className="badge">
            <svg width="18" height="18" fill="none" stroke="#2c3fd1" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" />
            </svg>
            24/7 Support
          </div>
        </div>
      </div>
    </section>
  );
}
