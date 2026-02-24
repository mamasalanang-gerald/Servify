import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Upload, X, ImageIcon } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import { categoryService } from '../services/categoryService';
import { uploadServiceImage } from '../services/cloudinaryService';

const MAX_PACKAGES = 4;
const emptyPackage = () => ({ name: '', price: '', description: '', duration: '' });
const emptyForm = { title: '', category_id: '', price: '', description: '', service_type: 'onsite', location: '', packages: [], image_url: '' };

const parsePackages = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizePackages = (packages = []) =>
  packages
    .map((pkg) => ({
      name: String(pkg?.name || '').trim(),
      price:
        pkg?.price === '' || pkg?.price === null || pkg?.price === undefined
          ? ''
          : Number(pkg.price),
      description: String(pkg?.description || '').trim(),
      duration: String(pkg?.duration || '').trim(),
    }))
    .filter(
      (pkg) =>
        pkg.name !== '' ||
        pkg.price !== '' ||
        pkg.description !== '' ||
        pkg.duration !== '',
    );

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [togglingIds, setTogglingIds] = useState(new Set());
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    serviceService
      .getMyServices()
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(console.error);
    categoryService
      .getAllCategories()
      .then((res) => setCategories(res.categories || []))
      .catch(console.error);
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditTarget(null);
    setImageFile(null);
    setImagePreview('');
    setUploadError('');
    setShowModal(true);
  };

  const openEdit = (svc) => {
    const parsedPackages = parsePackages(svc.packages).map((pkg) => ({
      name: String(pkg?.name || ''),
      price:
        pkg?.price === '' || pkg?.price === null || pkg?.price === undefined
          ? ''
          : String(pkg.price),
      description: String(pkg?.description || ''),
      duration: String(pkg?.duration || ''),
    }));

    setForm({
      title: svc.title,
      category_id: svc.category_id,
      price: String(svc.price ?? ''),
      description: svc.description || '',
      service_type: svc.service_type || 'onsite',
      location: svc.location || '',
      packages: parsedPackages,
      image_url: svc.image_url || '',
    });
    setEditTarget(svc.id);
    setImageFile(null);
    setImagePreview(svc.image_url || '');
    setUploadError('');
    setShowModal(true);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Use JPEG, PNG, or WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File too large. Maximum 5MB.');
      return;
    }

    setUploadError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm((prev) => ({ ...prev, image_url: '' }));
    setUploadError('');
  };

  const addPackage = () => {
    if (form.packages.length >= MAX_PACKAGES) return;
    setForm((prev) => ({
      ...prev,
      packages: [...prev.packages, emptyPackage()],
    }));
  };

  const removePackage = (index) => {
    setForm((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
    }));
  };

  const updatePackage = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === index ? { ...pkg, [key]: value } : pkg,
      ),
    }));
  };

  const toggleStatus = async (id) => {
    const svc = services.find((s) => s.id === id);
    if (!svc || togglingIds.has(id)) return;

    const currentStatus = Boolean(svc.is_active);
    const nextStatus = !currentStatus;

    setTogglingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: nextStatus } : s)),
    );

    try {
      const updated = await serviceService.updateServiceStatus(id, nextStatus);
      setServices((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, is_active: Boolean(updated?.is_active) } : s,
        ),
      );
    } catch (err) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, is_active: currentStatus } : s,
        ),
      );
      console.error("Failed to update service status:", err);
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.category_id) return;

    const packageTiers = normalizePackages(form.packages);
    if (packageTiers.length > MAX_PACKAGES) return;

    const invalidPackage = packageTiers.some(
      (pkg) => !pkg.name || !Number.isFinite(pkg.price) || pkg.price <= 0,
    );
    if (invalidPackage) return;

    const basePrice = Number(form.price);
    const resolvedPrice =
      packageTiers.length > 0
        ? Math.min(...packageTiers.map((pkg) => pkg.price))
        : basePrice;

    if (!Number.isFinite(resolvedPrice) || resolvedPrice <= 0) return;

    try {
      // Upload image to Cloudinary if a new file was selected
      let imageUrl = form.image_url || null;
      if (imageFile) {
        setUploading(true);
        setUploadError('');
        try {
          imageUrl = await uploadServiceImage(imageFile);
        } catch (err) {
          setUploadError(err.message || 'Image upload failed');
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      const payload = {
        title: form.title,
        category_id: form.category_id,
        price: resolvedPrice,
        description: form.description,
        service_type: form.service_type || 'onsite',
        location: form.location || '',
        packages: packageTiers,
        image_url: imageUrl,
      };

      if (editTarget) {
        await serviceService.updateService(editTarget, payload);
      } else {
        await serviceService.createService(payload);
      }
      const updated = await serviceService.getMyServices();
      setServices(Array.isArray(updated) ? updated : []);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    await serviceService.deleteService(id);
    const updated = await serviceService.getMyServices();
    setServices(Array.isArray(updated) ? updated : []);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <Card key={svc.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-1 ${svc.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{svc.title}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{svc.category_name}</span>
                </div>
                <Badge variant={svc.is_active ? 'success' : 'secondary'} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {svc.is_active ? 'Active' : 'Paused'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">₱{Number(svc.price).toLocaleString()}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Starting price</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{svc.total_bookings || 0}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Bookings</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{parseFloat(svc.average_rating) > 0 ? parseFloat(svc.average_rating).toFixed(1) : '—'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <label htmlFor={`service-toggle-${svc.id}`} className="relative inline-flex items-center cursor-pointer">
                    <input 
                      id={`service-toggle-${svc.id}`}
                      type="checkbox" 
                      checked={svc.is_active}
                      onChange={() => toggleStatus(svc.id)}
                      disabled={togglingIds.has(svc.id)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-60"></div>
                  </label>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{svc.is_active ? 'Listed' : 'Hidden'}</span>
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
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Photo</label>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={imagePreview} alt="Preview" className="w-full h-[180px] object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Click to upload a photo</span>
                  <span className="text-xs text-gray-400">JPEG, PNG, or WebP · Max 5MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
              {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
            </div>

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
                <Select value={String(form.category_id)} onValueChange={(value) => setForm({ ...form, category_id: Number(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base Price (₱)</label>
                <Input 
                  type="number" 
                  placeholder="Required only when no package tier is added" 
                  value={form.price} 
                  onChange={(e) => setForm({ ...form, price: e.target.value })} 
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price Packages (Optional, up to {MAX_PACKAGES})
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPackage}
                  disabled={form.packages.length >= MAX_PACKAGES}
                >
                  Add Package
                </Button>
              </div>
              {form.packages.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No package tiers added. Base Price will be used.
                </p>
              ) : (
                <div className="space-y-2">
                  {form.packages.map((pkg, index) => (
                    <div key={`package-${index}`} className="grid grid-cols-12 gap-2">
                      <Input
                        className="col-span-3"
                        placeholder="Tier"
                        value={pkg.name}
                        onChange={(e) => updatePackage(index, 'name', e.target.value)}
                      />
                      <Input
                        className="col-span-3"
                        type="number"
                        placeholder="₱ Price"
                        value={pkg.price}
                        onChange={(e) => updatePackage(index, 'price', e.target.value)}
                      />
                      <Input
                        className="col-span-4"
                        placeholder="Description"
                        value={pkg.description}
                        onChange={(e) => updatePackage(index, 'description', e.target.value)}
                      />
                      <Button
                        className="col-span-2"
                        type="button"
                        variant="destructive"
                        onClick={() => removePackage(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
            <Button variant="outline" onClick={() => setShowModal(false)} disabled={uploading}>Cancel</Button>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />Uploading...</>
              ) : (
                editTarget ? 'Save Changes' : 'Add Service'
              )}
            </Button>
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
