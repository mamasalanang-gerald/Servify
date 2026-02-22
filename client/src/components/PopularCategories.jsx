import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <section className="py-20 px-12 bg-[#f0f2f8] dark:bg-[#131929] transition-colors">
      <div className="text-center mb-10">
        <h2 className="font-heading text-[2rem] font-bold text-app-text dark:text-[#f1f5f9] mb-1.5 transition-colors">
          Popular Categories
        </h2>
        <p className="font-sans text-app-text-muted dark:text-[#94a3b8] text-[0.95rem] transition-colors">
          Explore services across various categories
        </p>
      </div>
      <div className="grid grid-cols-4 gap-5 max-w-[1100px] mx-auto md:grid-cols-2 sm:grid-cols-1">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="flex flex-col items-center text-center gap-2 py-8 px-7 rounded-2xl border-[1.5px] border-app-border dark:border-[#2a3045] bg-white dark:bg-[#1a1f2e] cursor-pointer transition-all hover:border-app-accent dark:hover:border-[#7b93ff] hover:shadow-[0_8px_28px_rgba(44,63,209,0.1)] dark:hover:shadow-[0_8px_28px_rgba(123,147,255,0.15)] hover:-translate-y-1 [&:hover_.category-icon-wrap]:bg-app-accent dark:[&:hover_.category-icon-wrap]:bg-app-accent [&:hover_.category-icon-wrap_svg]:stroke-white"
            onClick={() => navigate('/services', { state: { category: cat.label } })}
          >
            <div className="category-icon-wrap w-14 h-14 bg-[#eef1fb] dark:bg-[#222a40] rounded-full flex items-center justify-center mb-3 transition-colors">
              {cat.icon}
            </div>
            <span className="font-heading font-semibold text-base text-app-text dark:text-[#f1f5f9] transition-colors">
              {cat.label}
            </span>
            <span className="font-sans text-[0.85rem] text-[#94a3b8] dark:text-[#64748b] transition-colors">
              {cat.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}