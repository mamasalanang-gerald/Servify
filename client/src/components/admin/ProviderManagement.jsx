import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';

const ProviderManagement = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers({ page, limit: 8, role: 'provider' });
      setProviders(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleVerify = async (providerId) => {
    try {
      await adminService.verifyProvider(providerId);
      toast({
        title: 'Success',
        description: 'Provider verified successfully',
      });
      fetchProviders();
      setShowModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.email.toLowerCase().includes(search.toLowerCase())
  );

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default">Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center py-8 text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredProviders.length === 0 ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center py-8 text-slate-500">
                  No providers found
                </TableCell>
              </TableRow>
            ) : (
              filteredProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-semibold text-slate-900">{provider.name}</TableCell>
                  <TableCell className="text-slate-600">{provider.email}</TableCell>
                  <TableCell className="text-slate-600">{provider.servicesCount || 0}</TableCell>
                  <TableCell className="text-slate-600">
                    {provider.rating ? `${provider.rating.toFixed(1)} ⭐` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {getVerificationBadge(provider.verificationStatus)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedProvider(provider);
                        setShowModal(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Provider Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-700">Name</div>
                <p className="text-slate-900">{selectedProvider.name}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Email</div>
                <p className="text-slate-900">{selectedProvider.email}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Services</div>
                <p className="text-slate-900">{selectedProvider.servicesCount || 0}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Rating</div>
                <p className="text-slate-900">
                  {selectedProvider.rating ? `${selectedProvider.rating.toFixed(1)} ⭐` : 'N/A'}
                </p>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">Verification Status</div>
                <p className="text-slate-900">{selectedProvider.verificationStatus}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Close
            </Button>
            {selectedProvider && selectedProvider.verificationStatus === 'pending' && (
              <Button onClick={() => handleVerify(selectedProvider.id)}>
                Verify Provider
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderManagement;
