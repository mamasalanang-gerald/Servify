import React from 'react';
import { Button } from '@/components/ui/button';

const AdminTopbar = ({ title, subtitle, actions }) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white px-8 py-3.5 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Servify Admin Panel · {today}
        </p>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default AdminTopbar;
