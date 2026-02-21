import React, { useState } from 'react';
import '../pages/styles/ProviderEarnings.css';

const transactions = [
  { id: 1, date: 'Feb 18, 2026', client: 'Lena Macaraeg', service: 'Standard Clean',      gross: 89,  fee: 9,  net: 80  },
  { id: 2, date: 'Feb 15, 2026', client: 'James Torres',  service: 'Deep House Cleaning', gross: 229, fee: 23, net: 206 },
  { id: 3, date: 'Feb 12, 2026', client: 'Ana Reyes',     service: 'Standard Clean',      gross: 89,  fee: 9,  net: 80  },
  { id: 4, date: 'Feb 8, 2026',  client: 'Paul Katigbak', service: 'Deep House Cleaning', gross: 149, fee: 15, net: 134 },
  { id: 5, date: 'Feb 5, 2026',  client: 'Sofia Araneta', service: 'Move-In/Out Clean',   gross: 229, fee: 23, net: 206 },
  { id: 6, date: 'Jan 28, 2026', client: 'Marco Dizon',   service: 'Standard Clean',      gross: 89,  fee: 9,  net: 80  },
  { id: 7, date: 'Jan 22, 2026', client: 'Maria Santos',  service: 'Deep House Cleaning', gross: 149, fee: 15, net: 134 },
];

const payouts = [
  { id: 1, date: 'Feb 15, 2026', method: 'GCash',    amount: '₱1,200' },
  { id: 2, date: 'Jan 31, 2026', method: 'GCash',    amount: '₱2,340' },
  { id: 3, date: 'Jan 15, 2026', method: 'BDO Bank', amount: '₱1,880' },
];

const monthlyData = [
  { month: 'Sep', net: 820  },
  { month: 'Oct', net: 1240 },
  { month: 'Nov', net: 960  },
  { month: 'Dec', net: 1780 },
  { month: 'Jan', net: 2100 },
  { month: 'Feb', net: 920  },
];
const maxM = Math.max(...monthlyData.map((d) => d.net));

const ProviderEarnings = () => {
  const [activeTab, setActiveTab] = useState('Transactions');

  return (
    <div className="earnings-wrapper">
      {/* Summary cards */}
      <div className="earnings-summary">
        {[
          { label: 'Total Earned',   value: '₱12,480', sub: 'All time',           color: '#16a34a' },
          { label: 'This Month',     value: '₱920',    sub: 'Feb 2026',           color: '#2b52cc' },
          { label: 'Pending Payout', value: '₱920',    sub: 'Est. Mar 1 release', color: '#f59e0b' },
        ].map((s) => (
          <div key={s.label} className="earnings-stat p-card">
            <div className="earnings-stat__dot" style={{ background: s.color }} />
            <div className="earnings-stat__value" style={{ color: s.color }}>{s.value}</div>
            <div className="earnings-stat__label">{s.label}</div>
            <div className="earnings-stat__sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <div className="p-card">
        <div className="p-card__header"><h3 className="p-card__title">Monthly Earnings (Net)</h3></div>
        <div className="p-card__body">
          <div className="earnings-chart">
            {monthlyData.map((d) => (
              <div key={d.month} className="earnings-chart__col">
                <span className="earnings-chart__val">₱{d.net}</span>
                <div className="earnings-chart__spacer">
                  <div
                    className={`earnings-chart__bar ${d.net === maxM ? 'earnings-chart__bar--peak' : ''}`}
                    style={{ height: `${(d.net / maxM) * 100}%` }}
                  />
                </div>
                <span className="earnings-chart__month">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-tabs">
        {['Transactions', 'Payouts'].map((t) => (
          <button key={t} className={`p-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {/* Transactions table */}
      {activeTab === 'Transactions' && (
        <div className="p-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="p-table">
              <thead>
                <tr><th>Date</th><th>Client</th><th>Service</th><th>Gross</th><th>Platform Fee</th><th>Net Earned</th></tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td className="earnings-client">{t.client}</td>
                    <td>{t.service}</td>
                    <td className="earnings-mono">₱{t.gross}</td>
                    <td className="earnings-mono earnings-fee">−₱{t.fee}</td>
                    <td className="earnings-mono earnings-net">₱{t.net}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payouts table */}
      {activeTab === 'Payouts' && (
        <div className="p-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="p-table">
              <thead>
                <tr><th>Date</th><th>Method</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.date}</td>
                    <td className="earnings-client">{p.method}</td>
                    <td className="earnings-mono">{p.amount}</td>
                    <td><span className="p-badge p-badge--completed"><span className="p-badge__dot" />Completed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderEarnings;