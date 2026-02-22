import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const ProfileSettings = () => {
  const [form, setForm] = useState({
    firstName: 'Carlo',
    lastName: 'Dela Cruz',
    email: 'Carlo.dcxgh@gmail.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">First Name</label>
            <Input type="text" name="firstName" value={form.firstName} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Last Name</label>
            <Input type="text" name="lastName" value={form.lastName} onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone</label>
          <Input type="text" name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Address</label>
          <Input type="text" name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit">
            {saved ? (
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