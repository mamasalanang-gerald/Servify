import "./PopularCategories.css";

const categories = [
  {
    label: "Home Cleaning",
    count: "234 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2c3fd1" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" strokeLinejoin="round"/>
        <path d="M9 21V12h6v9" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Plumbing",
    count: "156 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2c3fd1" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l2.6-2.6a6 6 0 01-7.6 7.6L5 21a2.12 2.12 0 01-3-3l7.3-7.7a6 6 0 017.6-7.6l-2.6 2.6z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Beauty & Spa",
    count: "189 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2c3fd1" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Tutoring",
    count: "298 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2c3fd1" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" strokeLinejoin="round"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Repairs",
    count: "145 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2c3fd1" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
  {
    label: "Digital Services",
    count: "312 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2c3fd1" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Moving",
    count: "87 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2c3fd1" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v3h-7V8z" strokeLinejoin="round"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    label: "Pet Care",
    count: "124 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2c3fd1" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function PopularCategories() {
  return (
    <section className="categories">
      <div className="categories-header">
        <h2 className="categories-title">Popular Categories</h2>
        <p className="categories-subtitle">Explore services across various categories</p>
      </div>
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat.label} className="category-card">
            <div className="category-icon-wrap">{cat.icon}</div>
            <span className="category-label">{cat.label}</span>
            <span className="category-count">{cat.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}