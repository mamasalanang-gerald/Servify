import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoryService } from "../services/categoryService";
import useAuth from "../hooks/useAuth";

// Map category names to SVG icons
const categoryIcons = {
  "Home Cleaning": (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" strokeLinejoin="round" />
    </svg>
  ),
  Plumbing: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  Carpentry: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
  xmlns="http://www.w3.org/2000/svg"
>
  <g transform="scale(1.2)">
    <path
      d="M 11.638672 0.89257812 C 9.6968368 0.80815061 8.1796875 2.1152344 8.1796875 2.1152344 A 0.50005 0.50005 0 0 0 8.6210938 2.984375 C 8.6210938 2.984375 10.342903 2.5499342 11.646484 3.8535156 C 11.719708 3.9267389 11.875 4.3333333 11.875 4.75 C 11.875 5.1666667 11.719708 5.5732611 11.646484 5.6464844 L 8.734375 8.5585938 L 8.7324219 8.5585938 A 0.50005 0.50005 0 0 0 8.4921875 8.5 A 0.50005 0.50005 0 0 0 8.1464844 8.6464844 L 0.14648438 16.646484 A 0.50005 0.50005 0 0 0 0.14648438 17.353516 L 2.1464844 19.353516 A 0.50005 0.50005 0 0 0 2.8535156 19.353516 L 10.853516 11.353516 A 0.50005 0.50005 0 0 0 10.941406 10.765625 L 14.75 6.9570312 L 15.292969 7.5 L 15.146484 7.6464844 A 0.50005 0.50005 0 0 0 15.146484 8.3535156 L 16.646484 9.8535156 A 0.50005 0.50005 0 0 0 17.353516 9.8535156 L 19.853516 7.3535156 A 0.50005 0.50005 0 0 0 19.853516 6.6464844 L 18.353516 5.1464844 A 0.50005 0.50005 0 0 0 17.646484 5.1464844 L 17.5 5.2929688 L 16.941406 4.734375 L 16.941406 4.7324219 A 0.50005 0.50005 0 0 0 16.853516 4.1464844 L 15.353516 2.6464844 A 0.50005 0.50005 0 0 0 14.765625 2.5585938 L 14.353516 2.1464844 C 13.49128 1.2842485 12.521207 0.93094933 11.638672 0.89257812 z M 11.595703 1.8925781 C 12.257356 1.9213461 12.94622 2.1532515 13.646484 2.8535156 L 14.396484 3.6035156 A 0.50005 0.50005 0 0 0 14.984375 3.6914062 L 15.808594 4.515625 A 0.50005 0.50005 0 0 0 15.808594 4.5175781 A 0.50005 0.50005 0 0 0 15.896484 5.1035156 L 17.146484 6.3535156 A 0.50005 0.50005 0 0 0 17.853516 6.3535156 L 18 6.2070312 L 18.792969 7 L 17 8.7929688 L 16.207031 8 L 16.353516 7.8535156 A 0.50005 0.50005 0 0 0 16.353516 7.1464844 L 15.103516 5.8964844 A 0.50005 0.50005 0 0 0 14.396484 5.8964844 L 10.25 10.042969 L 9.4570312 9.25 L 12.353516 6.3535156 C 12.780292 5.9267389 12.875 5.3333333 12.875 4.75 C 12.875 4.1666667 12.780292 3.5732611 12.353516 3.1464844 C 11.779442 2.5724108 11.159019 2.310211 10.5625 2.1445312 C 10.909394 2.0432192 11.206918 1.8756745 11.595703 1.8925781 z M 8.5 9.7070312 L 9.7929688 11 L 2.5 18.292969 L 1.2070312 17 L 8.5 9.7070312 z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </g>
</svg>
  ),
  Gardening: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M7 17h10l-1.5 4H8.5L7 17z" strokeLinejoin="round" />
      <path d="M6 17h12" strokeLinecap="round" />
      <path d="M12 17V9" strokeLinecap="round" />
      <path d="M12 13C10 11 7 11 7 8c3 0 5 2 5 5z" strokeLinejoin="round" />
      <path d="M12 11c2-2 5-2 5-5-3 0-5 2-5 5z" strokeLinejoin="round" />
    </svg>
  ),
  Painting: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="5" y="4" width="14" height="6" rx="1.5" strokeLinejoin="round" />
      <path d="M12 10v4" strokeLinecap="round" />
      <path d="M9 14h6" strokeLinecap="round" />
      <path d="M12 14v4" strokeLinecap="round" />
      <path d="M12 18c0 1.1-.5 2-1 2" strokeLinecap="round" />
    </svg>
  ),
  Electrical: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
};

const defaultIcon = (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" strokeLinecap="round" />
  </svg>
);

export default function PopularCategories() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService
      .getCategoriesWithCounts()
      .then((res) => setCategories(res.categories || []))
      .catch(console.error);
  }, []);

  const handleCategoryClick = (categoryName) => {
    const role = user?.role;

    if (!role) {
      navigate("/login", {
        state: {
          redirectAfterLogin: "/dashboard",
          initialNav: "Services",
          initialCategory: categoryName,
          source: "popular-categories",
        },
      });
      return;
    }

    if (role === "provider") {
      navigate("/provider");
      return;
    }

    if (role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/dashboard", {
      state: {
        initialNav: "Services",
        initialCategory: categoryName,
        source: "popular-categories",
      },
    });
  };

  return (
    <section className="py-20 px-12 bg-[#f0f2f8] dark:bg-[#131929] transition-colors">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-[2rem] font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-2 transition-colors">
            Popular Categories
          </h2>
          <p className="text-[0.95rem] text-[#64748b] dark:text-[#94a3b8] transition-colors">
            Explore services across various categories
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-4 md:grid-cols-3 sm:grid-cols-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group flex flex-col items-center text-center py-10 px-6 rounded-2xl bg-white dark:bg-[#1a1f2e] border border-[#e2e6f0] dark:border-[#2a3045] cursor-pointer transition-all duration-200 hover:border-[#2c3fd1] dark:hover:border-[#7b93ff] hover:shadow-[0_8px_28px_rgba(44,63,209,0.12)] dark:hover:shadow-[0_8px_28px_rgba(123,147,255,0.12)] hover:-translate-y-1"

            >
              {/* Icon circle */}
              <div className="w-16 h-16 rounded-full bg-[#eef1fb] dark:bg-[#222a40] text-[#2c3fd1] dark:text-[#7b93ff] flex items-center justify-center mb-5 transition-all duration-200 group-hover:bg-[#2c3fd1] dark:group-hover:bg-[#2c3fd1] group-hover:text-white dark:group-hover:text-white">
                {categoryIcons[cat.name] || defaultIcon}
              </div>

              <span className="font-semibold text-[0.95rem] text-[#0f172a] dark:text-[#f1f5f9] mb-1.5 transition-colors">
                {cat.name}
              </span>
              <span className="text-[0.82rem] text-[#94a3b8]">
                {cat.service_count} services
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
