const stats = [
  { label: "Total Bookings", value: "24", icon: "📋" },
  { label: "Completed", value: "18", icon: "✅" },
  { label: "Total Spent", value: "$840", icon: "💳" },
];

export default function DashboardStats() {
  return (
    <div className="dash-stats">
      {stats.map((s) => (
        <div key={s.label} className="dash-stat-card">
          <div>
            <span className="dash-stat-card__label">{s.label}</span>
            <span className="dash-stat-card__value">{s.value}</span>
          </div>
          <div className="dash-stat-card__icon">{s.icon}</div>
        </div>
      ))}
    </div>
  );
}
