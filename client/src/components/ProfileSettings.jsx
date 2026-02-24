import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Camera } from 'lucide-react';
import { userService } from '../services/userService';
import { uploadServiceImage } from '../services/cloudinaryService';

const ProfileSettings = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    profile_image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await userService.getProfile();
        setForm({
          full_name: profile.full_name || '',
          email: profile.email || '',
          phone_number: profile.phone_number || '',
          profile_image: profile.profile_image || '',
        });
        setImagePreview(profile.profile_image || '');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
    setError(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Use JPEG, PNG, or WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum 5MB.');
      return;
    }

    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setSaved(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let profileImageUrl = form.profile_image || null;

      // Upload new photo to Cloudinary if a new file was selected
      if (imageFile) {
        profileImageUrl = await uploadServiceImage(imageFile);
        setImageFile(null);
      }

      await userService.updateProfile({
        ...form,
        profile_image: profileImageUrl,
      });
      setForm((prev) => ({ ...prev, profile_image: profileImageUrl || '' }));
      // Sync to localStorage so Navbar/Sidebar update immediately
      if (profileImageUrl) {
        localStorage.setItem('servify_profile_image', profileImageUrl);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Profile Photo */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center text-xl font-bold">
                {getInitials(form.full_name)}
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="h-5 w-5 text-white" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{form.full_name || 'Your Name'}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Click the photo to change it</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <Input 
            type="text" 
            name="full_name" 
            value={form.full_name} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone</label>
          <Input 
            type="text" 
            name="phone_number" 
            value={form.phone_number} 
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : saved ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved!
              </>
            ) : 'Save Changes'}
          </Button>
          {saved && <span className="text-sm text-green-600 dark:text-green-400">Changes saved successfully.</span>}
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;