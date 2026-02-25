import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { providerService } from '../services/providerService';
import useAuth from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const defaultSummary = {
  totalEarned: 0,
  monthEarned: 0,
  pendingPayout: 0,
};

const defaultMonthlyData = [
  { month: 'Jan', net: 0 },
  { month: 'Feb', net: 0 },
  { month: 'Mar', net: 0 },
  { month: 'Apr', net: 0 },
  { month: 'May', net: 0 },
  { month: 'Jun', net: 0 },
];

const ProviderEarnings = () => {
  const [activeTab, setActiveTab] = useState('Transactions');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(defaultSummary);
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEarningsData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch all earnings data
        const [summaryData, transactionsData, payoutsData, monthlyDataRes] = await Promise.all([
          providerService.getEarningsSummary(user.id),
          providerService.getTransactions(user.id),
          providerService.getPayouts(user.id),
          providerService.getMonthlyEarnings(user.id, 6),
        ]);

        setSummary(summaryData && typeof summaryData === 'object' ? {
          totalEarned: Number(summaryData.totalEarned) || 0,
          monthEarned: Number(summaryData.monthEarned) || 0,
          pendingPayout: Number(summaryData.pendingPayout) || 0,
        } : defaultSummary);
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
        setPayouts(Array.isArray(payoutsData) ? payoutsData : []);
        setMonthlyData(
          Array.isArray(monthlyDataRes) && monthlyDataRes.length > 0
            ? monthlyDataRes
            : defaultMonthlyData
        );
      } catch (error) {
        console.error('Error fetching earnings data:', error);
        setSummary(defaultSummary);
        setTransactions([]);
        setPayouts([]);
        setMonthlyData(defaultMonthlyData);
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [user?.id]);

  const maxM = Math.max(...monthlyData.map((d) => d.net), 1);

  const summaryStats = [
    { 
      label: 'Total Earned', 
      value: `₱${summary.totalEarned.toLocaleString()}`, 
      sub: 'All time', 
      color: 'bg-green-500' 
    },
    { 
      label: 'This Month', 
      value: `₱${summary.monthEarned.toLocaleString()}`, 
      sub: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Pending Payout', 
      value: `₱${summary.pendingPayout.toLocaleString()}`, 
      sub: 'Est. next month release', 
      color: 'bg-yellow-500' 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
                      d.net === maxM && d.net > 0
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
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No transactions yet
              </div>
            ) : (
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
                        <td className="py-4 px-6 text-sm text-right font-mono text-gray-900 dark:text-gray-100">₱{t.gross.toLocaleString()}</td>
                        <td className="py-4 px-6 text-sm text-right font-mono text-red-600 dark:text-red-400">−₱{t.fee.toLocaleString()}</td>
                        <td className="py-4 px-6 text-sm text-right font-mono font-semibold text-green-600 dark:text-green-400">₱{t.net.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'Payouts' && (
        <Card>
          <CardContent className="p-0">
            {payouts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No payouts yet
              </div>
            ) : (
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
                        <td className="py-4 px-6 text-sm text-right font-mono font-semibold text-gray-900 dark:text-gray-100">₱{p.amount.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <Badge variant="success" className="flex items-center gap-1.5 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProviderEarnings;
