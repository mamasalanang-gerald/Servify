const AdminTopbar = ({ title, subtitle }) => {
  return (
    <div className="bg-white/90 backdrop-blur-2xl border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 w-full">
      <div>
        <div className="text-lg font-bold text-slate-900">{title}</div>
        <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
};

export default AdminTopbar;
