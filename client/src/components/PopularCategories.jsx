import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoryService } from "../services/categoryService";

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