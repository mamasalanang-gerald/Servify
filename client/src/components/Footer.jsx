export default function Footer() {
  return (
    <footer className="bg-[#0f172a] dark:bg-[#080d17] text-[#94a3b8] py-16 px-10 pb-6 transition-colors">
      <div className="flex justify-between gap-12 flex-wrap max-w-[1100px] mx-auto mb-12">
        <div className="flex flex-col gap-3 max-w-[260px]">
          <div className="w-9 h-9 bg-app-accent text-white rounded-lg flex items-center justify-center font-bold font-heading">
            S
          </div>
          <span className="font-heading font-bold text-[1.2rem] text-white">
            Servify
          </span>
          <p className="font-sans text-[0.88rem] leading-relaxed">
            Connecting people with trusted professionals.
          </p>
        </div>
        <div className="flex gap-16 flex-wrap">
          <div className="flex flex-col gap-2.5">
            <h4 className="font-heading text-[0.85rem] font-bold text-white uppercase tracking-wider mb-1">
              Company
            </h4>
            <a href="#" className="no-underline font-sans text-[0.9rem] text-[#94a3b8] transition-colors hover:text-white">
              About
            </a>
            <a href="#" className="no-underline font-sans text-[0.9rem] text-[#94a3b8] transition-colors hover:text-white">
              Careers
            </a>
            <a href="#" className="no-underline font-sans text-[0.9rem] text-[#94a3b8] transition-colors hover:text-white">
              Press
            </a>
          </div>
          <div className="flex flex-col gap-2.5">
            <h4 className="font-heading text-[0.85rem] font-bold text-white uppercase tracking-wider mb-1">
              Services
            </h4>
            <a href="#" className="no-underline font-sans text-[0.9rem] text-[#94a3b8] transition-colors hover:text-white">
              Browse All
            </a>
            <a href="#" className="no-underline font-sans text-[0.9rem] text-[#94a3b8] transition-colors hover:text-white">
              Become a Provider
            </a>
            <a href="#" className="no-underline font-sans text-[0.9rem] text-[#94a3b8] transition-colors hover:text-white">
              Pricing
            </a>
          </div>
          <div className="flex flex-col gap-2.5">
            <h4 className="font-heading text-[0.85rem] font-bold text-white uppercase tracking-wider mb-1">
              Support
            </h4>
            <a href="#" className="no-underline font-sans text-[0.9rem] text-[#94a3b8] transition-colors hover:text-white">
              Help Center
            </a>
            <a href="#" className="no-underline font-sans text-[0.9rem] text-[#94a3b8] transition-colors hover:text-white">
              Contact Us
            </a>
            <a href="#" className="no-underline font-sans text-[0.9rem] text-[#94a3b8] transition-colors hover:text-white">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1e293b] pt-6 text-center font-sans text-[0.85rem] max-w-[1100px] mx-auto">
        <span>© 2026 Servify. All rights reserved.</span>
      </div>
    </footer>
  );
}
