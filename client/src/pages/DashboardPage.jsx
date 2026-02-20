import { useState } from "react";
import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardStats from "../components/DashboardStats";
import BookingList from "../components/BookingList";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("Bookings");

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-header__title">My Dashboard</h1>
            <p className="dashboard-header__sub">Manage your bookings and account settings</p>
          </div>
          <DashboardStats />
          <BookingList />
        </main>
      </div>
    </div>
  );
}
