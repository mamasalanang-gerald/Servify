import React, { useState } from 'react';
import '../pages/styles/ProviderProfile.css';

const days      = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];

const ProviderProfile = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [saved, setSaved]         = useState(false);
  const [skills, setSkills]       = useState(['House Cleaning', 'Deep Cleaning', 'Post-Construction', 'Eco-Friendly Products']);
  const [newSkill, setNewSkill]   = useState('');
  const [form, setForm]           = useState({
    name: 'Juan dela Cruz',
    bio: 'Professional cleaner with 5+ years of experience. Specializing in deep cleaning, move-in/out cleans, and eco-friendly solutions. Serving Metro Manila and nearby areas.',
    phone: '+63 912 345 6789',
    email: 'juan.delacruz@email.com',
    address: 'Quezon City, Metro Manila',
    experience: '5 years',
  });
  const [availability, setAvailability] = useState({
    Monday:    { open: true,  start: '8:00 AM', end: '5:00 PM' },
    Tuesday:   { open: true,  start: '8:00 AM', end: '5:00 PM' },
    Wednesday: { open: true,  start: '8:00 AM', end: '5:00 PM' },
    Thursday:  { open: true,  start: '8:00 AM', end: '5:00 PM' },
    Friday:    { open: true,  start: '8:00 AM', end: '5:00 PM' },
    Saturday:  { open: true,  start: '9:00 AM', end: '3:00 PM' },
    Sunday:    { open: false, start: '9:00 AM', end: '3:00 PM' },
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const addSkill   = () => { if (newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill(''); } };
  const removeSkill = (i) => setSkills(skills.filter((_, idx) => idx !== i));

  return (
    <div className="profile-wrapper">
      <div className="p-tabs">
        {['Profile', 'Availability'].map((t) => (
          <button key={t} className={`p-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {/* ── Profile tab ── */}
      {activeTab === 'Profile' && (
        <div className="profile-layout">
          {/* Left: forms */}
          <div className="profile-forms">
            {/* Basic info */}
            <div className="p-card">
              <div className="p-card__header"><h3 className="p-card__title">Basic Information</h3></div>
              <div className="p-card__body profile-form-body">
                <div className="p-form__row">
                  <div className="p-form__group">
                    <label className="p-form__label">Full Name</label>
                    <input className="p-form__input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="p-form__group">
                    <label className="p-form__label">Years of Experience</label>
                    <input className="p-form__input" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                  </div>
                </div>
                <div className="p-form__group">
                  <label className="p-form__label">Bio / About Me</label>
                  <textarea className="p-form__textarea profile-bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                </div>
                <div className="p-form__row">
                  <div className="p-form__group">
                    <label className="p-form__label">Phone Number</label>
                    <input className="p-form__input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="p-form__group">
                    <label className="p-form__label">Email Address</label>
                    <input className="p-form__input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="p-form__group">
                  <label className="p-form__label">Service Area / Address</label>
                  <input className="p-form__input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="p-card">
              <div className="p-card__header"><h3 className="p-card__title">Skills & Specializations</h3></div>
              <div className="p-card__body">
                <div className="profile-skills">
                  {skills.map((s, i) => (
                    <span key={i} className="profile-skill-tag">
                      {s}
                      <button className="profile-skill-tag__remove" onClick={() => removeSkill(i)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="profile-skill-input">
                  <input
                    className="p-form__input"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <button className="p-btn p-btn--ghost" onClick={addSkill}>Add</button>
                </div>
              </div>
            </div>

            <div className="profile-save-row">
              <button className="p-btn p-btn--primary" onClick={handleSave}>
                {saved ? '✓ Saved!' : 'Save Changes'}
              </button>
              {saved && <span className="profile-save-msg">Profile updated successfully.</span>}
            </div>
          </div>

          {/* Right: avatar + stats */}
          <div className="profile-sidebar">
            <div className="p-card profile-avatar-card">
              <div className="profile-avatar">JD</div>
              <div className="profile-avatar-name">{form.name}</div>
              <div className="profile-avatar-sub">Service Provider · {form.experience}</div>
              <button className="p-btn p-btn--ghost profile-photo-btn">Change Photo</button>
            </div>

            <div className="p-card profile-stats-card">
              <h3 className="profile-stats-title">Profile Stats</h3>
              {[
                { label: 'Completed Jobs', value: '84' },
                { label: 'Response Rate',  value: '98%' },
                { label: 'Repeat Clients', value: '34' },
                { label: 'Member Since',   value: 'Mar 2021' },
              ].map((s) => (
                <div key={s.label} className="profile-stat-row">
                  <span className="profile-stat-row__label">{s.label}</span>
                  <span className="profile-stat-row__value">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Availability tab ── */}
      {activeTab === 'Availability' && (
        <div className="p-card">
          <div className="p-card__header"><h3 className="p-card__title">Weekly Availability</h3></div>
          <div className="p-card__body availability-body">
            {days.map((day) => {
              const av = availability[day];
              return (
                <div key={day} className="avail-row">
                  <label className="p-toggle">
                    <input type="checkbox" checked={av.open} onChange={() => setAvailability({ ...availability, [day]: { ...av, open: !av.open } })} />
                    <span className="p-toggle__track" />
                  </label>
                  <span className={`avail-row__day ${av.open ? 'avail-row__day--on' : ''}`}>{day}</span>
                  {av.open ? (
                    <div className="avail-row__times">
                      <select className="p-form__select avail-select" value={av.start} onChange={(e) => setAvailability({ ...availability, [day]: { ...av, start: e.target.value } })}>
                        {timeSlots.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      <span className="avail-row__to">to</span>
                      <select className="p-form__select avail-select" value={av.end} onChange={(e) => setAvailability({ ...availability, [day]: { ...av, end: e.target.value } })}>
                        {timeSlots.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  ) : (
                    <span className="avail-row__off">Day off</span>
                  )}
                </div>
              );
            })}
            <div className="availability-save">
              <button className="p-btn p-btn--primary" onClick={handleSave}>
                {saved ? '✓ Saved!' : 'Save Availability'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfile;