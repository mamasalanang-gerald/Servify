import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoryService } from "../services/categoryService";

const categories = [
  {
    label: "Home Cleaning",
    count: "234 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" strokeLinejoin="round"/>
        <path d="M9 21V12h6v9" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Plumbing",
    count: "156 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l2.6-2.6a6 6 0 01-7.6 7.6L5 21a2.12 2.12 0 01-3-3l7.3-7.7a6 6 0 017.6-7.6l-2.6 2.6z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Beauty & Spa",
    count: "189 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M12 3c-1.2 5.4-5 7.8-5 12a5 5 0 0010 0c0-4.2-3.8-6.6-5-12z" strokeLinejoin="round"/>
        <path d="M9.5 15a2.5 2.5 0 005 0" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Tutoring",
    count: "298 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" strokeLinejoin="round"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Repairs",
    count: "145 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
  {
    label: "Digital Services",
    count: "312 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Moving",
    count: "87 services",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
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
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinejoin="round"/>
      </svg>
    ),
  },
];
// Map category names to SVG icons (icons are UI, not data)
const categoryIcons = {
  "Home Cleaning": (
    <svg
      width="28"
      height="28"
      fill="none"
      stroke="#2c3fd1"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        strokeLinejoin="round"
      />
      <path d="M9 21V12h6v9" strokeLinejoin="round" />
    </svg>
  ),
  Plumbing: (
    <svg
      width="28"
      height="28"
      fill="none"
      stroke="#2c3fd1"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {/* Water drop */}
      <path
        d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
  Carpentry: (
    <svg
      width="28"
      height="28"
      fill="none"
      stroke="#2c3fd1"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {/* Hammer head */}
      <path
        d="M15 5l-1.5 1.5L9 2 4 7l4.5 4.5L7 13l4 4 1.5-1.5L17 20l3-3-4.5-4.5L17 11z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
  Gardening: (
    <svg
      width="28"
      height="28"
      fill="none"
      stroke="#2c3fd1"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {/* Pot */}
      <path d="M7 17h10l-1.5 4H8.5L7 17z" strokeLinejoin="round" />
      {/* Soil line */}
      <path d="M6 17h12" strokeLinecap="round" />
      {/* Stem */}
      <path d="M12 17V9" strokeLinecap="round" />
      {/* Left leaf */}
      <path d="M12 13C10 11 7 11 7 8c3 0 5 2 5 5z" strokeLinejoin="round" />
      {/* Right leaf */}
      <path d="M12 11c2-2 5-2 5-5-3 0-5 2-5 5z" strokeLinejoin="round" />
    </svg>
  ),
  Painting: (
    <svg
      width="28"
      height="28"
      fill="none"
      stroke="#2c3fd1"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {/* Paint roller frame */}
      <rect x="5" y="4" width="14" height="6" rx="1.5" strokeLinejoin="round" />
      {/* Roller handle */}
      <path d="M12 10v4" strokeLinecap="round" />
      {/* Handle grip */}
      <path d="M9 14h6" strokeLinecap="round" />
      {/* Handle stem */}
      <path d="M12 14v4" strokeLinecap="round" />
      {/* Drip */}
      <path d="M12 18c0 1.1-.5 2-1 2" strokeLinecap="round" />
    </svg>
  ),
  Electrical: (
    <svg
      width="28"
      height="28"
      fill="none"
      stroke="#2c3fd1"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {/* Lightning bolt */}
      <path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const defaultIcon = (
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="#2c3fd1"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" strokeLinecap="round" />
  </svg>
);

export default function PopularCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService
      .getCategoriesWithCounts()
      .then((res) => setCategories(res.categories || []))
      .catch(console.error);
  }, []);

  return (
    <section className="py-16 px-6 bg-[#eef0f8] dark:bg-[#131929] transition-colors">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-[2rem] font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-2 transition-colors">
            Popular Categories
          </h2>
          <p className="text-[0.95rem] text-[#64748b] dark:text-[#94a3b8] transition-colors">
            Explore services across various categories
          </p>
        </div>

        {/* Grid — forced 4 columns via inline style, dark mode via className */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}
        >
          {categories.map((cat) => (
            <div
              key={cat.label}
              onClick={() => navigate('/services', { state: { category: cat.label } })}
              className="group flex flex-col items-center text-center py-10 px-6 rounded-2xl bg-white dark:bg-[#1a1f2e] border border-[#e2e6f0] dark:border-[#2a3045] cursor-pointer transition-all duration-200 hover:border-[#2c3fd1] dark:hover:border-[#7b93ff] hover:shadow-[0_8px_28px_rgba(44,63,209,0.12)] dark:hover:shadow-[0_8px_28px_rgba(123,147,255,0.12)] hover:-translate-y-1"
            >
              {/* Icon circle */}
              <div className="w-16 h-16 rounded-full bg-[#eef1fb] dark:bg-[#222a40] text-[#2c3fd1] dark:text-[#7b93ff] flex items-center justify-center mb-5 transition-all duration-200 group-hover:bg-[#2c3fd1] dark:group-hover:bg-[#2c3fd1] group-hover:text-white dark:group-hover:text-white">
                {cat.icon}
              </div>

              <span className="font-semibold text-[0.95rem] text-[#0f172a] dark:text-[#f1f5f9] mb-1.5 transition-colors">
                {cat.label}
              </span>
              <span className="text-[0.82rem] text-[#94a3b8]">
                {cat.count}
              </span>
            </div>
          ))}
        </div>
    <section className="py-20 px-12 bg-[#f0f2f8] dark:bg-[#131929] transition-colors">
      {/* ... keep existing heading JSX ... */}
      <div className="grid grid-cols-4 gap-5 max-w-[1100px] mx-auto md:grid-cols-2 sm:grid-cols-1">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="/* ... keep existing classes ... */"
            onClick={() =>
              navigate("/services", { state: { category: cat.name } })
            }
          >
            <div className="category-icon-wrap w-14 h-14 bg-[#eef1fb] dark:bg-[#222a40] rounded-full flex items-center justify-center mb-3 transition-colors">
              {categoryIcons[cat.name] || defaultIcon}
            </div>
            <span className="font-heading font-semibold text-base text-app-text dark:text-[#f1f5f9]">
              {cat.name}
            </span>
            <span className="font-sans text-[0.85rem] text-[#94a3b8] dark:text-[#64748b]">
              {cat.service_count} services
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}