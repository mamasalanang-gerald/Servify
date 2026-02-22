import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';

const ServiceModeration = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await adminService.getServices({ page, limit: 10 });
      setServices(response.data || []);
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
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

  const handleToggleStatus = async (serviceId) => {
    try {
      await adminService.toggleServiceStatus(serviceId);
      toast({
        title: 'Success',
        description: 'Service status updated successfully',
      });
      fetchServices();
      setShowModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search by name or provider..."
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
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
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
            ) : filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center py-8 text-slate-500">
                  No services found
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-semibold text-slate-900">{service.name}</TableCell>
                  <TableCell className="text-slate-600">{service.provider}</TableCell>
                  <TableCell className="text-slate-600">{service.category}</TableCell>
                  <TableCell className="text-slate-600">${service.price}</TableCell>
                  <TableCell>
                    <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedService(service);
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

      {/* Service Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Service Details</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <p className="text-slate-900">{selectedService.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Provider</label>
                <p className="text-slate-900">{selectedService.provider}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Category</label>
                <p className="text-slate-900">{selectedService.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Price</label>
                <p className="text-slate-900">${selectedService.price}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <p className="text-slate-900">{selectedService.status}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Close
            </Button>
            {selectedService && (
              <Button
                variant={selectedService.status === 'active' ? 'destructive' : 'default'}
                onClick={() => handleToggleStatus(selectedService.id)}
              >
                {selectedService.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceModeration;
