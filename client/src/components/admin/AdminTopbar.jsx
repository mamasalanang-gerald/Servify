const AdminTopbar = ({ title, subtitle }) => {
  return (
    <div className="bg-card/90 backdrop-blur-2xl border-b border-border px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 w-full">
      <div>
        <div className="text-lg font-bold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
};

export default AdminTopbar;
