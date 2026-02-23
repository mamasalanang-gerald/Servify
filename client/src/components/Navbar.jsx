import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import LogoutButton from "./LogoutButton";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Navbar({ activePage = "" }) {
  const user = authService.getUser();

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <nav className="flex items-center justify-between px-12 h-[68px] bg-white/92 dark:bg-[#0f172a]/95 border-b border-app-border dark:border-[#1e293b] sticky top-0 z-[100] backdrop-blur-2xl transition-all gap-6 font-sans">
      <a href="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-app-primary to-app-accent text-white rounded-[10px] flex items-center justify-center font-extrabold text-base shadow-[0_4px_12px_rgba(26,58,143,0.3)]">
          S
        </div>
        <span className="font-bold text-[1.1rem] text-app-text dark:text-[#f1f5f9] transition-colors">
          Servify
        </span>
      </a>

      <ul className="flex list-none gap-9 m-0 p-0 flex-1 md:flex hidden">
        <li>
          <a
            href="/services"
            className={cn(
              "no-underline text-app-text-muted dark:text-[#94a3b8] text-[0.9rem] font-medium transition-colors whitespace-nowrap relative",
              "hover:text-app-text dark:hover:text-[#f1f5f9]",
              "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-app-accent dark:after:bg-[#7b9fff] after:rounded-sm after:scale-x-0 after:transition-transform after:duration-200",
              "hover:after:scale-x-100",
              activePage === "services" && "text-app-accent dark:text-[#7b9fff] font-semibold after:scale-x-100"
            )}
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="/become-provider"
            className={cn(
              "no-underline text-app-text-muted dark:text-[#94a3b8] text-[0.9rem] font-medium transition-colors whitespace-nowrap relative",
              "hover:text-app-text dark:hover:text-[#f1f5f9]",
              "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-app-accent dark:after:bg-[#7b9fff] after:rounded-sm after:scale-x-0 after:transition-transform after:duration-200",
              "hover:after:scale-x-100",
              activePage === "become-provider" && "text-app-accent dark:text-[#7b9fff] font-semibold after:scale-x-100"
            )}
          >
            Become a Provider
          </a>
        </li>
        <li>
          <a
            href="/dashboard"
            className={cn(
              "no-underline text-app-text-muted dark:text-[#94a3b8] text-[0.9rem] font-medium transition-colors whitespace-nowrap relative",
              "hover:text-app-text dark:hover:text-[#f1f5f9]",
              "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-app-accent dark:after:bg-[#7b9fff] after:rounded-sm after:scale-x-0 after:transition-transform after:duration-200",
              "hover:after:scale-x-100",
              activePage === "dashboard" && "text-app-accent dark:text-[#7b9fff] font-semibold after:scale-x-100"
            )}
          >
            Dashboard
          </a>
        </li>
      </ul>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Dark mode toggle */}
        <button
          className="w-9 h-9 rounded-full border-[1.5px] border-app-border dark:border-[#1e293b] bg-transparent cursor-pointer flex items-center justify-center text-app-text-muted dark:text-[#94a3b8] transition-all hover:bg-app-accent-light hover:text-app-accent hover:border-app-accent dark:hover:bg-[#1e3a5f] dark:hover:text-[#7b9fff] dark:hover:border-[#7b9fff]"
          onClick={() => setDark(!dark)}
          aria-label="Toggle theme"
        >
          {dark ? (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {user ? (
          /* Logged in: profile dropdown */
          <div className="relative inline-flex group">
            <button
              className="w-9 h-9 rounded-full border-[1.5px] border-app-border dark:border-[#1e293b] bg-transparent cursor-pointer flex items-center justify-center text-app-text-muted dark:text-[#94a3b8] transition-all hover:bg-app-accent-light hover:text-app-accent hover:border-app-accent dark:hover:bg-[#1e3a5f] dark:hover:text-[#7b9fff] dark:hover:border-[#7b9fff]"
              aria-label="Account"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Dropdown */}
            <div className="absolute top-[calc(100%+12px)] right-0 min-w-[190px] bg-white/98 dark:bg-[#0f172a]/98 border border-app-border dark:border-[#1e293b] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-3 flex flex-col gap-1.5 opacity-0 pointer-events-none -translate-y-1.5 transition-all duration-200 z-[200] group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 before:content-[''] before:absolute before:-top-1.5 before:right-3 before:w-2.5 before:h-2.5 before:bg-white dark:before:bg-[#0f172a] before:border-l before:border-t before:border-app-border dark:before:border-[#1e293b] before:rotate-45">
              <span className="text-[0.8rem] font-semibold text-app-text dark:text-[#f1f5f9] overflow-hidden whitespace-nowrap text-ellipsis px-1.5">
                {user.email}
              </span>
              <span className="text-[0.72rem] capitalize text-app-text-muted dark:text-[#94a3b8] px-1.5 mb-1">
                {user.role}
              </span>
              <hr className="border-none border-t border-app-border dark:border-[#1e293b] my-1" />
              <a
                href={
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "provider"
                    ? "/provider"
                    : "/dashboard"
                }
                className="text-[0.83rem] font-medium text-app-text dark:text-[#f1f5f9] no-underline py-1.5 px-2.5 rounded-lg transition-all hover:bg-app-accent-light hover:text-app-accent dark:hover:bg-[#1e3a5f] dark:hover:text-[#7b9fff]"
              >
                My Dashboard
              </a>
              <LogoutButton className="[&_.logout-btn]:font-sans [&_.logout-btn]:text-[0.83rem] [&_.logout-btn]:font-medium [&_.logout-btn]:text-red-600 [&_.logout-btn]:bg-none [&_.logout-btn]:border-none [&_.logout-btn]:cursor-pointer [&_.logout-btn]:py-1.5 [&_.logout-btn]:px-2.5 [&_.logout-btn]:rounded-lg [&_.logout-btn]:text-left [&_.logout-btn]:w-full [&_.logout-btn]:transition-all [&_.logout-btn]:hover:bg-red-600/8" />
            </div>
          </div>
        ) : (
          /* Logged out: Login + Register buttons */
          <>
            <a
              href="/login"
              className="py-2 px-4.5 bg-transparent text-app-accent dark:text-[#7b9fff] border-[1.5px] border-app-accent dark:border-[#7b9fff] rounded-[10px] font-sans text-[0.88rem] font-semibold cursor-pointer no-underline inline-flex items-center transition-all whitespace-nowrap hover:bg-app-accent-light dark:hover:bg-[#1e3a5f] hover:-translate-y-0.5"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="py-2 px-5.5 bg-gradient-to-br from-app-primary to-app-accent text-white border-none rounded-[10px] font-sans text-[0.88rem] font-semibold cursor-pointer no-underline inline-flex items-center transition-all shadow-[0_4px_12px_rgba(26,58,143,0.25)] whitespace-nowrap hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,58,143,0.35)]"
            >
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}