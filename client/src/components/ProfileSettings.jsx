import React, { useState } from 'react';
import '../pages/styles/ProfileSettings.css';

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
    <div className="dash-section">
      <h2 className="dash-section__title">Profile Settings</h2>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-form__row">
          <div className="profile-form__group">
            <label className="profile-form__label">First Name</label>
            <input type="text" name="firstName" className="profile-form__input" value={form.firstName} onChange={handleChange} />
          </div>
          <div className="profile-form__group">
            <label className="profile-form__label">Last Name</label>
            <input type="text" name="lastName" className="profile-form__input" value={form.lastName} onChange={handleChange} />
          </div>
        </div>

        <div className="profile-form__group">
          <label className="profile-form__label">Email</label>
          <input type="email" name="email" className="profile-form__input" value={form.email} onChange={handleChange} />
        </div>

        <div className="profile-form__group">
          <label className="profile-form__label">Phone</label>
          <input type="text" name="phone" className="profile-form__input" value={form.phone} onChange={handleChange} />
        </div>

        <div className="profile-form__group">
          <label className="profile-form__label">Address</label>
          <input type="text" name="address" className="profile-form__input" value={form.address} onChange={handleChange} />
        </div>

        <div className="profile-form__footer">
          <button type="submit" className="profile-form__btn">
            {saved ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved!
              </>
            ) : 'Save Changes'}
          </button>
          {saved && <span className="profile-form__success">Changes saved successfully.</span>}
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;