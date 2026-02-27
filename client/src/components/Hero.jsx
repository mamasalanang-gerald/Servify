import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useAuth from "../hooks/useAuth";

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const search = query.trim();
    if (!search) return;

    const role = user?.role;
    const state = {
      initialNav: "Services",
      initialSearchQuery: search,
      source: "landing-search",
    };

    if (!role) {
      navigate("/login", {
        state: {
          redirectAfterLogin: "/dashboard",
          ...state,
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

    navigate("/dashboard", { state });
  };

  return (
    <section className="bg-gradient-to-br from-[#eef1fb] via-[#f4f6fd] to-[#e8eaf6] dark:from-[#131929] dark:via-[#0f1623] dark:to-[#131929] min-h-[calc(100vh-64px)] flex items-center justify-center px-8 py-16 relative overflow-hidden transition-colors before:content-[''] before:absolute before:w-[600px] before:h-[600px] before:bg-[radial-gradient(circle,rgba(44,63,209,0.08)_0%,transparent_70%)] before:-top-[100px] before:-right-[100px] before:pointer-events-none">
      <div className="text-center max-w-[720px]">
        <h1 className="font-heading text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold text-app-text dark:text-[#f1f5f9] leading-[1.15] mb-5 transition-colors">
          Book Trusted Services<br />
          <span className="text-app-accent dark:text-[#7b93ff]">Anytime, Anywhere</span>
        </h1>
        <p className="font-sans text-[1.05rem] text-app-text-muted dark:text-[#94a3b8] max-w-[560px] mx-auto mb-10 leading-[1.7] transition-colors">
          Connect with verified professionals for home services, repairs, beauty, tutoring, and
          more. Quality service at your fingertips.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex bg-white dark:bg-[#1a1f2e] rounded-xl shadow-[0_4px_24px_rgba(44,63,209,0.1),0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] overflow-hidden mb-10 max-w-[620px] mx-auto transition-colors"
        >
          <Input
            type="text"
            placeholder="Search for services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-none outline-none px-6 py-4 text-[0.95rem] font-sans text-app-text dark:text-[#f1f5f9] bg-transparent placeholder:text-[#94a3b8] transition-colors"
          />
          <Button
            type="submit"
            className="flex items-center gap-2 bg-app-accent hover:bg-[#1e2fa8] text-white border-none px-7 font-sans font-semibold text-[0.95rem] cursor-pointer transition-colors rounded-none"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            Search
          </Button>
        </form>

        <div className="flex justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2 text-[#475569] dark:text-[#94a3b8] font-sans text-[0.9rem] font-medium transition-colors">
            <svg width="18" height="18" fill="none" stroke="#2c3fd1" className="dark:stroke-[#7b93ff]" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Verified Providers
          </div>
          <div className="flex items-center gap-2 text-[#475569] dark:text-[#94a3b8] font-sans text-[0.9rem] font-medium transition-colors">
            <svg width="18" height="18" fill="none" stroke="#2c3fd1" className="dark:stroke-[#7b93ff]" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Payments
          </div>
          <div className="flex items-center gap-2 text-[#475569] dark:text-[#94a3b8] font-sans text-[0.9rem] font-medium transition-colors">
            <svg width="18" height="18" fill="none" stroke="#2c3fd1" className="dark:stroke-[#7b93ff]" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" />
            </svg>
            24/7 Support
          </div>
        </div>
      </div>
    </section>
  );
}
