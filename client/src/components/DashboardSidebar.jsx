const navItems = [
  { label: "Bookings", icon: "📋" },
  { label: "Favorites", icon: "❤️" },
  { label: "Messages", icon: "💬" },
  { label: "Payments", icon: "💳" },
  { label: "Settings", icon: "⚙️" },
];

export default function DashboardSidebar({ activeNav, setActiveNav }) {
  return (
    <aside className="dash-sidebar">
      <div className="dash-profile">
        <div className="dash-profile__avatar">JD</div>
        <p className="dash-profile__name">Juan Dela Cruz</p>
        <p className="dash-profile__email">juan@email.com</p>
      </div>
      <nav className="dash-nav">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`dash-nav__item ${activeNav === item.label ? "active" : ""}`}
            onClick={() => setActiveNav(item.label)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
