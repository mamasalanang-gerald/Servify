import React, { useState } from 'react';
import '../pages/styles/ProviderServices.css';

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
    <div className="services-wrapper">
      <div className="services-grid">
        {services.map((svc) => (
          <div key={svc.id} className="svc-card p-card">
            <div className={`svc-card__strip ${svc.status === 'active' ? 'svc-card__strip--active' : ''}`} />
            <div className="svc-card__body">
              <div className="svc-card__head">
                <div>
                  <h3 className="svc-card__title">{svc.title}</h3>
                  <span className="svc-card__category">{svc.category}</span>
                </div>
                <span className={`p-badge ${svc.status === 'active' ? 'p-badge--active' : 'p-badge--paused'}`}>
                  <span className="p-badge__dot" />{svc.status === 'active' ? 'Active' : 'Paused'}
                </span>
              </div>

              <div className="svc-card__metrics">
                <div className="svc-card__metric">
                  <div className="svc-card__metric-val">₱{svc.price}</div>
                  <div className="svc-card__metric-lbl">Starting price</div>
                </div>
                <div className="svc-card__metric">
                  <div className="svc-card__metric-val">{svc.bookings}</div>
                  <div className="svc-card__metric-lbl">Bookings</div>
                </div>
                <div className="svc-card__metric">
                  <div className="svc-card__metric-val">{svc.rating > 0 ? svc.rating : '—'}</div>
                  <div className="svc-card__metric-lbl">Rating</div>
                </div>
              </div>

              <div className="svc-card__footer">
                <div className="svc-card__toggle-wrap">
                  <label className="p-toggle">
                    <input type="checkbox" checked={svc.status === 'active'} onChange={() => toggleStatus(svc.id)} />
                    <span className="p-toggle__track" />
                  </label>
                  <span className="svc-card__toggle-lbl">{svc.status === 'active' ? 'Listed' : 'Hidden'}</span>
                </div>
                <div className="svc-card__actions">
                  <button className="p-btn p-btn--ghost p-btn--sm" onClick={() => openEdit(svc)}>Edit</button>
                  <button className="p-btn p-btn--danger p-btn--sm" onClick={() => setDeleteConfirm(svc.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="svc-add-placeholder" onClick={openAdd}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add New Service</span>
        </button>
      </div>

      {showModal && (
        <div className="p-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="p-modal" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal__header">
              <h2 className="p-modal__title">{editTarget ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="p-modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="p-modal__body">
              <div className="p-form__group">
                <label className="p-form__label">Service Title</label>
                <input className="p-form__input" placeholder="e.g. Deep House Cleaning" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="p-form__row">
                <div className="p-form__group">
                  <label className="p-form__label">Category</label>
                  <select className="p-form__select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="p-form__group">
                  <label className="p-form__label">Starting Price (₱)</label>
                  <input className="p-form__input" type="number" placeholder="89" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>
              <div className="p-form__group">
                <label className="p-form__label">Description</label>
                <textarea className="p-form__textarea" placeholder="Describe your service..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="p-form__group">
                <label className="p-form__label">Estimated Duration</label>
                <input className="p-form__input" placeholder="e.g. 3–5 hours" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
            </div>
            <div className="p-modal__footer">
              <button className="p-btn p-btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="p-btn p-btn--primary" onClick={handleSave}>{editTarget ? 'Save Changes' : 'Add Service'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="p-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="p-modal p-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal__header">
              <h2 className="p-modal__title">Delete Service?</h2>
              <button className="p-modal__close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="p-modal__body">
              <p className="svc-delete-msg">This will permanently remove the service. This action cannot be undone.</p>
            </div>
            <div className="p-modal__footer">
              <button className="p-btn p-btn--ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="p-btn p-btn--danger" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderServices;