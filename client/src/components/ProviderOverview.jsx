import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  Star, 
  Plus, 
  CalendarCheck, 
  MessageSquare 
} from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';

const statusConfig = {
  pending:   { label: 'Pending',   variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  accepted:  { label: 'Confirmed', variant: 'default' },
  rejected:  { label: 'Rejected',  variant: 'destructive' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

const normalizeStatus = (status) => {
  const current = String(status || 'pending').toLowerCase();
  if (current === 'accepted') return 'confirmed';
  if (current === 'rejected') return 'cancelled';
  return current;
};

const ProviderOverview = () => {
  const [chartPeriod, setChartPeriod] = useState('Week');
  const [overviewStats, setOverviewStats] = useState({
    totalEarnings: '₱0',
    totalBookings: '0',
    pendingRequests: '0',
    avgRating: '—',
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [weeklyData] = useState([
    { day: 'Mon', amount: 0 },
    { day: 'Tue', amount: 0 },
    { day: 'Wed', amount: 0 },
    { day: 'Thu', amount: 0 },
    { day: 'Fri', amount: 0 },
    { day: 'Sat', amount: 0 },
    { day: 'Sun', amount: 0 },
  ]);

  useEffect(() => {
    const user = authService.getUser();
    if (!user?.id) return;

    bookingService.getProviderBookings(user.id).then((bookings) => {
      const arr = Array.isArray(bookings) ? bookings : [];
      const completed = arr.filter((b) => b.status === 'completed');
      const pending = arr.filter((b) => b.status === 'pending');

      setOverviewStats({
        totalEarnings: `₱${completed.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0).toLocaleString()}`,
        totalBookings: arr.length.toString(),
        pendingRequests: pending.length.toString(),
        avgRating: '—',
      });

      setRecentBookings(
        arr.slice(0, 3).map((b) => ({
          id: b.id,
          client: b.client_name || 'Client',
          service: b.service_name || 'Service',
          date: new Date(b.booking_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          amount: `₱${Number(b.total_price || 0).toLocaleString()}`,
          status: normalizeStatus(b.status),
        })),
      );
    }).catch(console.error);
  }, []);

  const maxVal = Math.max(...weeklyData.map((d) => d.amount), 1);

  const stats = [
    {
      label: 'Total Earnings',
      value: overviewStats.totalEarnings,
      icon: DollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Bookings',
      value: overviewStats.totalBookings,
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Pending Requests',
      value: overviewStats.pendingRequests,
      icon: Clock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Avg. Rating',
      value: overviewStats.avgRating,
      icon: Star,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ];

  const quickActions = [
    { label: 'Add New Service', icon: Plus, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: `View Pending (${overviewStats.pendingRequests})`, icon: Clock, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { label: 'Update Availability', icon: CalendarCheck, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'View All Reviews', icon: MessageSquare, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Earnings Overview</CardTitle>
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {['Week', 'Month'].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    chartPeriod === period
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48 mb-4">
              {weeklyData.map((d) => (
                <div key={d.day} className="flex flex-col items-center flex-1 h-full">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 h-5">
                    {d.amount > 0 ? `₱${d.amount}` : ''}
                  </span>
                  <div className="flex-1 w-full flex items-end justify-center">
                    <div
                      className={`w-full max-w-[32px] rounded-t-lg transition-all ${
                        d.amount === maxVal && d.amount > 0
                          ? 'bg-gradient-to-t from-blue-600 to-blue-500'
                          : 'bg-gradient-to-t from-blue-400 to-blue-300'
                      }`}
                      style={{ height: d.amount > 0 ? `${(d.amount / maxVal) * 100}%` : '4px' }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">This week</span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{overviewStats.totalEarnings}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className={`p-2 rounded-lg ${action.iconBg}`}>
                    <Icon className={`h-4 w-4 ${action.iconColor}`} />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Recent Bookings</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View All →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-4">
                    Client
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-4">
                    Service
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-4">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider py-3 px-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => {
                  const statusInfo = statusConfig[booking.status] || statusConfig.pending;
                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {booking.client}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                        {booking.service}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                        {booking.date}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {booking.amount}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={statusInfo.variant}
                          className="flex items-center gap-1.5 w-fit"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {booking.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                            Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderOverview;
