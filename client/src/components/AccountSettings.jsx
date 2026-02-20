import React, { useState } from 'react';
import '../pages/styles/AccountSettings.css';

const AccountSettings = () => {
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
    <div className="dash-section">
      <h2 className="dash-section__title">Settings</h2>

      {/* Notifications */}
      <div className="settings-block">
        <h3 className="settings-block__title">Notifications</h3>
        <p className="settings-block__desc">Manage how you receive updates and alerts.</p>

        <div className="settings-toggles">
          {[
            { key: 'emailBookings', label: 'Email — Booking confirmations' },
            { key: 'emailPromotions', label: 'Email — Promotions & offers' },
            { key: 'smsReminders', label: 'SMS — Appointment reminders' },
            { key: 'smsUpdates', label: 'SMS — Service updates' },
          ].map(({ key, label }) => (
            <div className="settings-toggle" key={key}>
              <span className="settings-toggle__label">{label}</span>
              <button
                className={`settings-toggle__btn ${notifications[key] ? 'active' : ''}`}
                onClick={() => toggleNotif(key)}
                aria-label={label}
              >
                <span className="settings-toggle__knob" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="settings-block">
        <h3 className="settings-block__title">Change Password</h3>
        <p className="settings-block__desc">Update your password to keep your account secure.</p>

        <form className="profile-form" onSubmit={handlePasswordSubmit}>
          <div className="profile-form__group">
            <label className="profile-form__label">Current Password</label>
            <input
              type="password"
              name="current"
              className="profile-form__input"
              placeholder="Enter current password"
              value={passwords.current}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="profile-form__row">
            <div className="profile-form__group">
              <label className="profile-form__label">New Password</label>
              <input
                type="password"
                name="newPass"
                className="profile-form__input"
                placeholder="Enter new password"
                value={passwords.newPass}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="profile-form__group">
              <label className="profile-form__label">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                className="profile-form__input"
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          <div className="profile-form__footer">
            <button type="submit" className="profile-form__btn">
              {pwSaved ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Password Updated!
                </>
              ) : 'Update Password'}
            </button>
            {pwSaved && <span className="profile-form__success">Password updated successfully.</span>}
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="settings-block settings-block--danger">
        <h3 className="settings-block__title settings-block__title--danger">Danger Zone</h3>
        <p className="settings-block__desc">These actions are irreversible. Please proceed with caution.</p>
        <button className="settings-danger-btn">Delete Account</button>
      </div>
    </div>
  );
};

export default AccountSettings;