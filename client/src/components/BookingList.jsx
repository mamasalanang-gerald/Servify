import { useState } from "react";
import houseCleaningImg from "../assets/images/house_cleaning.jpg";
import plumbingImg from "../assets/images/plumbing_repair.jpg";
import mathImg from "../assets/images/math_physics.jpg";
import spaImg from "../assets/images/spa_massage.jpg";

const bookings = [
  { id: 1, title: "Deep Home Cleaning", provider: "Maria Santos", date: "Feb 22, 2026", status: "upcoming", total: "$49", img: houseCleaningImg },
  { id: 2, title: "Pipe Repair", provider: "Jake Rivera", date: "Feb 10, 2026", status: "completed", total: "$79", img: plumbingImg },
  { id: 3, title: "Math Tutoring", provider: "Dr. Amos", date: "Jan 30, 2026", status: "completed", total: "$35", img: mathImg },
  { id: 4, title: "Full Body Spa", provider: "Lily Chen", date: "Mar 1, 2026", status: "upcoming", total: "$89", img: spaImg },
];

const tabs = ["All", "Upcoming", "Completed"];

export default function BookingList() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = bookings.filter((b) => {
    if (activeTab === "All") return true;
    return b.status === activeTab.toLowerCase();
  });

  return (
    <div className="booking-list">
      <div className="booking-list__tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`booking-list__tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="booking-list__items">
        {filtered.map((b) => (
          <div key={b.id} className="booking-card">
            <div className="booking-card__icon">
              <img src={b.img} alt={b.title} />
            </div>
            <div className="booking-card__info">
              <p className="booking-card__title">{b.title}</p>
              <p className="booking-card__sub">{b.provider}</p>
              <div className="booking-card__meta">
                <span className="booking-card__date">📅 {b.date}</span>
                <span className={`booking-card__status booking-card__status--${b.status}`}>
                  {b.status}
                </span>
              </div>
            </div>
            <div className="booking-card__right">
              <span className="booking-card__total-label">Total</span>
              <span className="booking-card__total">{b.total}</span>
              <button className="booking-card__btn">
                {b.status === "upcoming" ? "Manage" : "Rebook"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
