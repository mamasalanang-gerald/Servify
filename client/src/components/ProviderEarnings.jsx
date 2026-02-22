import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

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

  const summaryStats = [
    { label: 'Total Earned',   value: '₱12,480', sub: 'All time',           color: 'bg-green-500' },
    { label: 'This Month',     value: '₱920',    sub: 'Feb 2026',           color: 'bg-blue-500' },
    { label: 'Pending Payout', value: '₱920',    sub: 'Est. Mar 1 release', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryStats.map((s) => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className={`w-2 h-2 rounded-full ${s.color} mb-4`} />
              <div className={`text-3xl font-bold mb-2 ${s.color.replace('bg-', 'text-')}`}>
                {s.value}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {s.label}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {s.sub}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings (Net)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-4 h-64">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex flex-col items-center flex-1 h-full">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 h-5">
                  {d.net > 0 ? `₱${d.net}` : ''}
                </span>
                <div className="flex-1 w-full flex items-end justify-center">
                  <div
                    className={`w-full max-w-[48px] rounded-t-lg transition-all ${
                      d.net === maxM
                        ? 'bg-gradient-to-t from-blue-600 to-blue-500'
                        : 'bg-gradient-to-t from-blue-400 to-blue-300'
                    }`}
                    style={{ height: d.net > 0 ? `${(d.net / maxM) * 100}%` : '4px' }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                  {d.month}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['Transactions', 'Payouts'].map((t) => (
          <button
            key={t}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === t
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            onClick={() => setActiveTab(t)}
          >
            {t}
            {activeTab === t && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Transactions' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-6">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-6">Client</th>
                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-6">Service</th>
                    <th className="text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-6">Gross</th>
                    <th className="text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-6">Platform Fee</th>
                    <th className="text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-6">Net Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">{t.date}</td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100">{t.client}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">{t.service}</td>
                      <td className="py-4 px-6 text-sm text-right font-mono text-gray-900 dark:text-gray-100">₱{t.gross}</td>
                      <td className="py-4 px-6 text-sm text-right font-mono text-red-600 dark:text-red-400">−₱{t.fee}</td>
                      <td className="py-4 px-6 text-sm text-right font-mono font-semibold text-green-600 dark:text-green-400">₱{t.net}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'Payouts' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-6">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-6">Method</th>
                    <th className="text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-6">Amount</th>
                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">{p.date}</td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100">{p.method}</td>
                      <td className="py-4 px-6 text-sm text-right font-mono font-semibold text-gray-900 dark:text-gray-100">{p.amount}</td>
                      <td className="py-4 px-6">
                        <Badge variant="success" className="flex items-center gap-1.5 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          Completed
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProviderEarnings;
