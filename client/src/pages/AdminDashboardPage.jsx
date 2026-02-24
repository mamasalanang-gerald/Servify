import { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import UserManagement from '../components/admin/UserManagement';
import ProviderManagement from '../components/admin/ProviderManagement';
import ServiceModeration from '../components/admin/ServiceModeration';
import BookingMonitoring from '../components/admin/BookingMonitoring';
import ReviewModeration from '../components/admin/ReviewModeration';
import CategoryManagement from '../components/admin/CategoryManagement';
import ApplicationManagement from '../components/admin/ApplicationManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

const pageMeta = {
  'Overview': { title: 'Overview', sub: 'Dashboard overview and key metrics' },
  'Users': { title: 'Users', sub: 'Manage user accounts' },
  'Providers': { title: 'Providers', sub: 'Manage service providers' },
  'Applications': { title: 'Applications', sub: 'Review provider applications' },
  'Services': { title: 'Services', sub: 'Moderate service listings' },
  'Bookings': { title: 'Bookings', sub: 'Monitor booking requests' },
  'Reviews': { title: 'Reviews', sub: 'Moderate user reviews' },
  'Categories': { title: 'Categories', sub: 'Manage service categories' },
};

const AdminDashboardPage = () => {
  const [activeNav, setActiveNav] = useState('Overview');
  const [metrics, setMetrics] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const { toast } = useToast();
  const meta = pageMeta[activeNav];

  const fetchDashboardMetrics = useCallback(async () => {
    try {
      setLoadingMetrics(true);
      const response = await adminService.getDashboardMetrics();
      setMetrics(response.data);
      
      // Fetch recent users
      const usersResponse = await adminService.getUsers({ page: 1, limit: 5 });
      setRecentUsers(usersResponse.data || []);
    } catch (error) {
      console.error('Dashboard metrics error:', error);
      const errorMessage = error.message || 'Failed to fetch dashboard metrics';
      
      // Check if it's an authentication error
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in as an admin to access this page. Use admin@servify.com / Admin@123456',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setLoadingMetrics(false);
    }
  }, [toast]);

  useEffect(() => {
    if (activeNav === 'Overview') {
      fetchDashboardMetrics();
    }
  }, [activeNav, fetchDashboardMetrics]);

  const renderContent = () => {
    switch (activeNav) {
      case 'Overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            {loadingMetrics ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalUsers || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalProviders || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bookings Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.bookingsToday || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.openReports || 0}</div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            {/* Recent Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan="5" className="text-center py-8 text-muted-foreground">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'provider' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                {user.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'Users':
        return <UserManagement />;
      case 'Providers':
        return <ProviderManagement />;
      case 'Applications':
        return <ApplicationManagement />;
      case 'Services':
        return <ServiceModeration />;
      case 'Bookings':
        return <BookingMonitoring />;
      case 'Reviews':
        return <ReviewModeration />;
      case 'Categories':
        return <CategoryManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      
      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <AdminTopbar title={meta.title} subtitle={meta.sub} />
        <main className="flex-1 overflow-auto px-8 py-7">
          {renderContent()}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminDashboardPage;
