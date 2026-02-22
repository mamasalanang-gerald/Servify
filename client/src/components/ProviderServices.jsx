import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus } from 'lucide-react';

const initialServices = [
  { id: 1, title: 'Deep House Cleaning', category: 'Cleaning', price: 89,  bookings: 52, rating: 4.9, status: 'active' },
  { id: 2, title: 'Standard Clean',      category: 'Cleaning', price: 149, bookings: 28, rating: 4.8, status: 'active' },
  { id: 3, title: 'Move-In/Out Clean',   category: 'Cleaning', price: 229, bookings: 4,  rating: 5.0, status: 'paused' },
];

const categories = ['Cleaning', 'Plumbing', 'Electrical', 'Gardening', 'Tutoring', 'Wellness', 'Other'];
const emptyForm  = { title: '', category: 'Cleaning', price: '', description: '', duration: '' };

const ProviderServices = () => {
  const [services, setServices]           = useState(initialServices);
  const [showModal, setShowModal]         = useState(false);
  const [editTarget, setEditTarget]       = useState(null);
  const [form, setForm]                   = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openAdd = () => { setForm(emptyForm); setEditTarget(null); setShowModal(true); };
  const openEdit = (svc) => {
    setForm({ title: svc.title, category: svc.category, price: svc.price, description: '', duration: '' });
    setEditTarget(svc.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title || !form.price) return;
    if (editTarget) {
      setServices(services.map((s) => s.id === editTarget ? { ...s, title: form.title, category: form.category, price: Number(form.price) } : s));
    } else {
      setServices([...services, { id: Date.now(), title: form.title, category: form.category, price: Number(form.price), bookings: 0, rating: 0, status: 'active' }]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id) =>
    setServices(services.map((s) => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s));

  const handleDelete = (id) => { setServices(services.filter((s) => s.id !== id)); setDeleteConfirm(null); };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <Card key={svc.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-1 ${svc.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{svc.title}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{svc.category}</span>
                </div>
                <Badge variant={svc.status === 'active' ? 'success' : 'secondary'} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {svc.status === 'active' ? 'Active' : 'Paused'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">₱{svc.price}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Starting price</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{svc.bookings}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Bookings</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{svc.rating > 0 ? svc.rating : '—'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={svc.status === 'active'} 
                      onChange={() => toggleStatus(svc.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{svc.status === 'active' ? 'Listed' : 'Hidden'}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(svc)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(svc.id)}>Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <button 
          onClick={openAdd}
          className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all cursor-pointer min-h-[280px]"
        >
          <Plus className="h-7 w-7 text-gray-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Add New Service</span>
        </button>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Title</label>
              <Input 
                placeholder="e.g. Deep House Cleaning" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Starting Price (₱)</label>
                <Input 
                  type="number" 
                  placeholder="89" 
                  value={form.price} 
                  onChange={(e) => setForm({ ...form, price: e.target.value })} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your service..." 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Duration</label>
              <Input 
                placeholder="e.g. 3–5 hours" 
                value={form.duration} 
                onChange={(e) => setForm({ ...form, duration: e.target.value })} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save Changes' : 'Add Service'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Service?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This will permanently remove the service. This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderServices;