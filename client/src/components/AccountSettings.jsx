import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const AccountSettings = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailPromotions: false,
    smsReminders: true,
    smsUpdates: false,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [pwSaved, setPwSaved] = useState(false);

  const toggleNotif = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPwSaved(true);
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPwSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>

      {/* Appearance */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
          <p className="text-sm text-muted-foreground">Customize how Servify looks for you.</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-foreground">Dark Mode</span>
            <p className="text-xs text-muted-foreground mt-0.5">{dark ? 'Currently using dark theme' : 'Currently using light theme'}</p>
          </div>
          <button
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              dark ? "bg-primary" : "bg-muted"
            )}
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
          >
            <span className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              dark ? "translate-x-6" : "translate-x-1"
            )} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          <p className="text-sm text-muted-foreground">Manage how you receive updates and alerts.</p>
        </div>

        <div className="space-y-4">
          {[
            { key: 'emailBookings', label: 'Email — Booking confirmations' },
            { key: 'emailPromotions', label: 'Email — Promotions & offers' },
            { key: 'smsReminders', label: 'SMS — Appointment reminders' },
            { key: 'smsUpdates', label: 'SMS — Service updates' },
          ].map(({ key, label }) => (
            <div className="flex items-center justify-between" key={key}>
              <span className="text-sm font-medium text-foreground">{label}</span>
              <button
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  notifications[key] ? "bg-primary" : "bg-muted"
                )}
                onClick={() => toggleNotif(key)}
                aria-label={label}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  notifications[key] ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
          <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
        </div>

        <form className="space-y-6" onSubmit={handlePasswordSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Current Password</label>
            <Input
              type="password"
              name="current"
              placeholder="Enter current password"
              value={passwords.current}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <Input
                type="password"
                name="newPass"
                placeholder="Enter new password"
                value={passwords.newPass}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <Input
                type="password"
                name="confirm"
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button type="submit">
              {pwSaved ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Password Updated!
                </>
              ) : 'Update Password'}
            </Button>
            {pwSaved && <span className="text-sm text-green-600 dark:text-green-400">Password updated successfully.</span>}
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-950/20">
        <div>
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
          <p className="text-sm text-red-600/80 dark:text-red-400/80">These actions are irreversible. Please proceed with caution.</p>
        </div>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  );
};

export default AccountSettings;