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
  // ... add your other icons here, keyed by category name
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