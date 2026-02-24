import React, { useState } from "react";
import "./ProviderDashboard.css";
import Navbar from "../../components/Navbar/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

const earningsData = [
  { month: "Jan", value: 4000 },
  { month: "Feb", value: 3800 },
  { month: "Mar", value: 5200 },
  { month: "Apr", value: 4800 },
  { month: "May", value: 6200 },
  { month: "Jun", value: 6500 },
];

const bookingsData = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 28 },
  { month: "Mar", value: 35 },
  { month: "Apr", value: 33 },
  { month: "May", value: 42 },
  { month: "Jun", value: 45 },
];

const serviceData = [
  { name: "Deep Cleaning", value: 45 },
  { name: "Quick Clean", value: 30 },
  { name: "Premium Clean", value: 25 },
];

const upcomingBookings = [
  { id: 1, service: "Deep House Cleaning", client: "Michael Chen", date: "2/20/2026", time: "10:00 AM", amount: 149, phone: "0917 123 4567" },
  { id: 2, service: "Standard Cleaning", client: "Emma Wilson", date: "2/22/2026", time: "2:00 PM", amount: 89, phone: "0918 234 5678" },
  { id: 3, service: "Premium Deep Clean", client: "David Park", date: "2/25/2026", time: "9:00 AM", amount: 249, phone: "0919 345 6789" },
];

const myServices = [
  { id: 1, name: "Deep House Cleaning", price: 89, status: "Active" },
  { id: 2, name: "Standard Cleaning", price: 59, status: "Active" },
  { id: 3, name: "Premium Deep Clean", price: 149, status: "Paused" },
];

const recentReviews = [
  { id: 1, name: "Sarah Johnson", date: "2/15/2026", rating: 5, comment: "Excellent service! Very thorough and professional." },
  { id: 2, name: "Tom Anderson", date: "2/12/2026", rating: 5, comment: "Best cleaning service I've used. Highly recommend!" },
  { id: 3, name: "Emily Roberts", date: "2/8/2026", rating: 4, comment: "Great job overall, very punctual and detail-oriented." },
];

const SERVICE_TYPES = [
  "Deep House Cleaning",
  "Standard Cleaning",
  "Premium Deep Clean",
  "Move-In/Move-Out Cleaning",
  "Office Cleaning",
  "Carpet Cleaning",
  "Window Cleaning",
  "Post-Construction Cleaning",
  "Other",
];

const COLORS = ["#1a3a8f", "#2b52cc", "#a5b4fc"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const sidebarItems = [
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    label: "Overview",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    label: "Bookings",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
      </svg>
    ),
    label: "My Services",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    label: "Reviews",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    label: "Settings",
  },
];

// ─── ADD SERVICE MODAL ────────────────────────────────────────────────────────
function AddServiceModal({ onClose, onAdd }) {
  const [name, setName] = useState(SERVICE_TYPES[0]);
  const [customName, setCustomName] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [price, setPrice] = useState("");
  const [saved, setSaved] = useState(false);

  const handleServiceTypeChange = (e) => {
    const val = e.target.value;
    if (val === "Other") { setIsCustom(true); setName("Other"); }
    else { setIsCustom(false); setName(val); setCustomName(""); }
  };

  const handleAdd = () => {
    const finalName = isCustom ? customName.trim() : name;
    if (!finalName || !price) return;
    setSaved(true);
    setTimeout(() => {
      onAdd({ id: Date.now(), name: finalName, price: Number(price), status: "Active" });
      onClose();
    }, 900);
  };

  const isValid = (isCustom ? customName.trim() : name) && Number(price) > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Add New Service</h2>
            <p className="modal-subtitle">Fill in the details to list a new service</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="edit-service-form">
          <div className="form-field">
            <label>Service Type</label>
            <select value={isCustom ? "Other" : name} onChange={handleServiceTypeChange}>
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {isCustom && (
            <div className="form-field">
              <label>Custom Service Name</label>
              <input
                type="text"
                placeholder="Enter your service name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>
          )}
          <div className="form-field">
            <label>Starting Price (₱)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 89"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ paddingLeft: "32px" }}
            />
            <span className="price-dollar-sign">₱</span>
          </div>
          <div className="payment-info-note">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
            </svg>
            New services are set to <strong>Active</strong> by default. You can pause them anytime.
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className={`modal-save-btn ${saved ? "saved" : ""}`}
            onClick={handleAdd}
            disabled={!isValid}
          >
            {saved ? (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Service
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT SERVICE MODAL ───────────────────────────────────────────────────────
function EditServiceModal({ service, onClose, onSave, onRemove }) {
  const [name, setName] = useState(service.name);
  const [customName, setCustomName] = useState(
    SERVICE_TYPES.includes(service.name) ? "" : service.name
  );
  const [isCustom, setIsCustom] = useState(!SERVICE_TYPES.includes(service.name));
  const [price, setPrice] = useState(service.price);
  const [saved, setSaved] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const handleServiceTypeChange = (e) => {
    const val = e.target.value;
    if (val === "Other") {
      setIsCustom(true);
      setName("Other");
    } else {
      setIsCustom(false);
      setName(val);
      setCustomName("");
    }
  };

  const handleSave = () => {
    const finalName = isCustom ? customName.trim() : name;
    if (!finalName || !price) return;
    setSaved(true);
    setTimeout(() => {
      onSave({ ...service, name: finalName, price: Number(price) });
      onClose();
    }, 900);
  };

  const handleConfirmRemove = () => {
    onRemove(service.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Service</h2>
            <p className="modal-subtitle">Update your service details</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="edit-service-form">

          {/* Service Type */}
          <div className="form-field">
            <label>Service Type</label>
            <select value={isCustom ? "Other" : name} onChange={handleServiceTypeChange}>
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Custom Name (shown when "Other" is selected) */}
          {isCustom && (
            <div className="form-field">
              <label>Custom Service Name</label>
              <input
                type="text"
                placeholder="Enter your service name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>
          )}

          {/* Price */}
          <div className="form-field">
            <label>Starting Price (₱)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 89"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ paddingLeft: "32px" }}
            />
            <span className="price-dollar-sign">₱</span>
          </div>

          {/* Remove section */}
          <div className="edit-remove-section">
            {!showConfirmRemove ? (
              <button className="remove-service-btn" onClick={() => setShowConfirmRemove(true)}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Service
              </button>
            ) : (
              <div className="confirm-remove-box">
                <p className="confirm-remove-text">
                  Are you sure you want to remove <strong>{service.name}</strong>? This cannot be undone.
                </p>
                <div className="confirm-remove-actions">
                  <button className="confirm-cancel-btn" onClick={() => setShowConfirmRemove(false)}>Cancel</button>
                  <button className="confirm-delete-btn" onClick={handleConfirmRemove}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Yes, Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className={`modal-save-btn ${saved ? "saved" : ""}`}
            onClick={handleSave}
            disabled={isCustom && !customName.trim()}
          >
            {saved ? (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MANAGE SCHEDULE MODAL ────────────────────────────────────────────────────
function ScheduleModal({ onClose }) {
  const [schedule, setSchedule] = useState({
    Monday:    { enabled: true,  start: "08:00", end: "17:00" },
    Tuesday:   { enabled: true,  start: "08:00", end: "17:00" },
    Wednesday: { enabled: true,  start: "08:00", end: "17:00" },
    Thursday:  { enabled: true,  start: "08:00", end: "17:00" },
    Friday:    { enabled: true,  start: "08:00", end: "17:00" },
    Saturday:  { enabled: false, start: "09:00", end: "14:00" },
    Sunday:    { enabled: false, start: "09:00", end: "14:00" },
  });
  const [saved, setSaved] = useState(false);

  const toggleDay = (day) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  };

  const updateTime = (day, field, value) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Manage Schedule</h2>
            <p className="modal-subtitle">Set your available working days and hours</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="schedule-list">
          {DAYS.map((day) => (
            <div key={day} className={`schedule-row ${schedule[day].enabled ? "enabled" : "disabled"}`}>
              <div className="schedule-day-toggle">
                <label className="toggle-switch">
                  <input type="checkbox" checked={schedule[day].enabled} onChange={() => toggleDay(day)} />
                  <span className="toggle-slider" />
                </label>
                <span className="schedule-day-name">{day}</span>
              </div>
              {schedule[day].enabled ? (
                <div className="schedule-times">
                  <div className="time-field">
                    <label>From</label>
                    <input type="time" value={schedule[day].start} onChange={(e) => updateTime(day, "start", e.target.value)} />
                  </div>
                  <span className="time-separator">—</span>
                  <div className="time-field">
                    <label>To</label>
                    <input type="time" value={schedule[day].end} onChange={(e) => updateTime(day, "end", e.target.value)} />
                  </div>
                </div>
              ) : (
                <span className="schedule-unavailable">Unavailable</span>
              )}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button className={`modal-save-btn ${saved ? "saved" : ""}`} onClick={handleSave}>
            {saved ? (<><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Saved!</>) : "Save Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT METHODS MODAL ────────────────────────────────────────────────────
function PaymentModal({ onClose }) {
  const [tab, setTab] = useState("bank");
  const [bank, setBank] = useState({ accountName: "", accountNumber: "", bankName: "" });
  const [ewallet, setEwallet] = useState({ provider: "GCash", mobileNumber: "", accountName: "" });
  const [cash, setCash] = useState({ receiptEnabled: true, exactChange: false, notes: "" });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Payment Methods</h2>
            <p className="modal-subtitle">Configure your payout preferences</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="payment-tabs">
          <button className={`payment-tab ${tab === "bank" ? "active" : ""}`} onClick={() => setTab("bank")}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6l9-3 9 3M4 10v8a1 1 0 001 1h14a1 1 0 001-1v-8" />
            </svg>
            Bank Account
          </button>
          <button className={`payment-tab ${tab === "ewallet" ? "active" : ""}`} onClick={() => setTab("ewallet")}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path strokeLinecap="round" d="M2 10h20" />
            </svg>
            E-Wallet
          </button>
          <button className={`payment-tab ${tab === "cash" ? "active" : ""}`} onClick={() => setTab("cash")}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2M3 9h18v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Cash
          </button>
        </div>

        {tab === "bank" && (
          <div className="payment-form">
            <div className="form-field">
              <label>Bank Name</label>
              <select value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })}>
                <option value="">Select your bank</option>
                <option>BDO Unibank</option>
                <option>BPI (Bank of the Philippine Islands)</option>
                <option>Metrobank</option>
                <option>UnionBank</option>
                <option>Land Bank of the Philippines</option>
                <option>Security Bank</option>
                <option>RCBC</option>
                <option>China Bank</option>
              </select>
            </div>
            <div className="form-field">
              <label>Account Name</label>
              <input type="text" placeholder="Full name as shown on account" value={bank.accountName} onChange={(e) => setBank({ ...bank, accountName: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Account Number</label>
              <input type="text" placeholder="Enter your account number" value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} />
            </div>
            <div className="payment-info-note">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
              </svg>
              Payouts are processed every Friday. Funds arrive within 1–3 business days.
            </div>
          </div>
        )}

        {tab === "ewallet" && (
          <div className="payment-form">
            <div className="form-field">
              <label>E-Wallet Provider</label>
              <div className="ewallet-options">
                {["GCash", "Maya", "ShopeePay"].map((p) => (
                  <button key={p} className={`ewallet-option ${ewallet.provider === p ? "active" : ""}`} onClick={() => setEwallet({ ...ewallet, provider: p })}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>Account Name</label>
              <input type="text" placeholder="Name registered to e-wallet" value={ewallet.accountName} onChange={(e) => setEwallet({ ...ewallet, accountName: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Mobile Number</label>
              <input type="tel" placeholder="09XX XXX XXXX" value={ewallet.mobileNumber} onChange={(e) => setEwallet({ ...ewallet, mobileNumber: e.target.value })} />
            </div>
            <div className="payment-info-note">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
              </svg>
              Payouts are processed every Friday. Funds arrive within 1–3 business days.
            </div>
          </div>
        )}

        {tab === "cash" && (
          <div className="payment-form">
            <div className="cash-hero">
              <div className="cash-icon">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#1a3a8f" strokeWidth="1.8">
                  <rect x="2" y="6" width="20" height="14" rx="2" />
                  <circle cx="12" cy="13" r="3" />
                  <path strokeLinecap="round" d="M6 10h.01M18 10h.01" />
                </svg>
              </div>
              <div>
                <h4 className="cash-hero-title">Cash on Hand</h4>
                <p className="cash-hero-desc">Collect payment directly from the client after each service is completed.</p>
              </div>
            </div>

            <div className="cash-toggle-group">
              <div className="cash-toggle-row">
                <div>
                  <span className="cash-toggle-label">Issue receipt after service</span>
                  <p className="cash-toggle-hint">Clients will receive a printed or digital receipt</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={cash.receiptEnabled} onChange={() => setCash({ ...cash, receiptEnabled: !cash.receiptEnabled })} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="cash-toggle-row">
                <div>
                  <span className="cash-toggle-label">Require exact change</span>
                  <p className="cash-toggle-hint">Notify clients to prepare the exact amount</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={cash.exactChange} onChange={() => setCash({ ...cash, exactChange: !cash.exactChange })} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            <div className="form-field">
              <label>Special Instructions (optional)</label>
              <textarea
                className="cash-notes"
                placeholder="e.g. Please prepare cash before I arrive..."
                value={cash.notes}
                onChange={(e) => setCash({ ...cash, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="payment-info-note">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
              </svg>
              Cash payments are collected on-site after the service is done. Confirm the total with your client beforehand.
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button className={`modal-save-btn ${saved ? "saved" : ""}`} onClick={handleSave}>
            {saved ? (<><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Saved!</>) : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
function ProviderDashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("servify-dark-mode");
    if (saved === "true") document.body.classList.add("dark");
    return saved === "true";
  });
  const [activeItem, setActiveItem] = useState("Overview");
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem("servify-services");
      return saved ? JSON.parse(saved) : myServices;
    } catch { return myServices; }
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.body.classList.toggle("dark", next);
    localStorage.setItem("servify-dark-mode", next);
  };

  const toggleServiceStatus = (id) => {
    const next = services.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Paused" : "Active" } : s);
    saveServices(next);
  };

  const saveServices = (updated) => {
    setServices(updated);
    localStorage.setItem("servify-services", JSON.stringify(updated));
  };

  const handleAddService = (newService) => {
    const updated = [...services, newService];
    saveServices(updated);
  };

  const handleSaveService = (updated) => {
    const next = services.map(s => s.id === updated.id ? updated : s);
    saveServices(next);
  };

  const handleRemoveService = (id) => {
    const next = services.filter(s => s.id !== id);
    saveServices(next);
  };


  const renderContent = () => {
    if (activeItem === "Bookings") {
      return (
        <div className="bookings-section">
          <h2 className="section-title">Upcoming Bookings</h2>
          <div className="bookings-list">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-info">
                  <h3 className="booking-service">{booking.service}</h3>
                  <p className="booking-client">Client: {booking.client}</p>
                  <div className="booking-datetime">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <span>{booking.date}</span>
                    <span>{booking.time}</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <div className="booking-phone">
                    <span className="phone-label">Contact</span>
                    <a href={"tel:" + booking.phone} className="phone-number">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {booking.phone}
                    </a>
                  </div>
                  <div className="booking-amount">
                    <span className="amount-label">Amount</span>
                    <span className="amount-value">₱{booking.amount}</span>
                  </div>
                  <button className="reschedule-btn">Reschedule</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeItem === "My Services") {
      return (
        <div className="services-section">
          <div className="services-header">
            <h2 className="section-title">My Services</h2>
            <button className="add-service-small-btn" onClick={() => setShowAddModal(true)}>+ Add Service</button>
          </div>
          <div className="services-list">
            {services.length === 0 && (
              <div className="no-services-msg">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
                </svg>
                <p>No services yet. Add your first service!</p>
              </div>
            )}
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-info">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-price">Starting from ₱{service.price}</p>
                  <span className={`service-badge ${service.status.toLowerCase()}`}>{service.status}</span>
                </div>
                <div className="service-actions">
                  <button className="edit-btn" onClick={() => setEditingService(service)}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ marginRight: 5 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    className={`pause-btn ${service.status === "Paused" ? "resume" : ""}`}
                    onClick={() => toggleServiceStatus(service.id)}
                  >
                    {service.status === "Active" ? "Pause" : "Resume"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeItem === "Reviews") {
      return (
        <div className="reviews-section">
          <h2 className="section-title">Recent Reviews</h2>
          <div className="reviews-list">
            {recentReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div>
                    <h3 className="review-author">{review.name}</h3>
                    <div className="review-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.rating ? "star-filled" : "star-empty"}>★</span>
                      ))}
                    </div>
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeItem === "Settings") {
      return (
        <div className="settings-section">
          <h2 className="section-title">Provider Settings</h2>

          <div className="settings-group">
            <h3 className="settings-group-title">Availability</h3>
            <p className="settings-group-desc">Set your working hours and days</p>
            <button className="settings-outline-btn" onClick={() => setShowScheduleModal(true)}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ marginRight: 7 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Manage Schedule
            </button>
          </div>

          <div className="settings-divider" />

          <div className="settings-group">
            <h3 className="settings-group-title">Payment Settings</h3>
            <p className="settings-group-desc">Configure your payout preferences</p>
            <button className="settings-outline-btn" onClick={() => setShowPaymentModal(true)}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ marginRight: 7 }}>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path strokeLinecap="round" d="M2 10h20" />
              </svg>
              Payment Methods
            </button>
          </div>


        </div>
      );
    }

    return (
      <>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">This Month</span>
              <span className="stat-value">₱6,200</span>
              <span className="stat-change positive">+18% from last month</span>
            </div>
            <div className="stat-icon blue">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Bookings</span>
              <span className="stat-value">42</span>
              <span className="stat-change positive">+11% from last month</span>
            </div>
            <div className="stat-icon blue">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Avg Rating</span>
              <span className="stat-value">4.9</span>
              <span className="stat-sub">342 reviews</span>
            </div>
            <div className="stat-icon yellow">
              <svg width="24" height="24" fill="#F59E0B" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Completion</span>
              <span className="stat-value">98%</span>
              <span className="stat-change positive">Excellent</span>
            </div>
            <div className="stat-icon green">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-card">
            <h3>Earnings Overview</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={earningsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <Tooltip formatter={(value) => [`₱${value}`, "Earnings"]} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="value" fill="#1a3a8f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Bookings Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={bookingsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Line type="monotone" dataKey="value" stroke="#1a3a8f" strokeWidth={2.5} dot={{ fill: "#1a3a8f", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Service Distribution</h3>
          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={serviceData} cx="50%" cy="50%" innerRadius={80} outerRadius={130} paddingAngle={4} dataKey="value">
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical" align="right" verticalAlign="middle"
                  formatter={(value, entry) => (
                    <span style={{ color: darkMode ? "#e5e7eb" : "#374151", fontSize: "14px", fontWeight: "500" }}>
                      {value} <strong>{entry.payload.value}%</strong>
                    </span>
                  )}
                />
                <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar darkMode={darkMode} onToggleDark={handleToggleDark} />
      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="provider-profile">
            <div className="provider-avatar">
              <img src="https://i.pravatar.cc/80?img=47" alt="Provider" />
            </div>
            <div className="provider-info">
              <h3>Sarah Johnson</h3>
              <p>Professional Cleaner</p>
              <div className="provider-rating">
                <span className="star">★</span>
                <span>4.9 (342 reviews)</span>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className={`sidebar-item ${activeItem === item.label ? "active" : ""}`}
                onClick={() => setActiveItem(item.label)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1>Provider Dashboard</h1>
              <p>Manage your services and track your performance</p>
            </div>
            {/* Removed duplicate "Add New Service" button from header */}
          </div>
          {renderContent()}
        </main>
      </div>

      {showScheduleModal && <ScheduleModal onClose={() => setShowScheduleModal(false)} />}
      {showPaymentModal  && <PaymentModal  onClose={() => setShowPaymentModal(false)} />}
      {showAddModal && (
        <AddServiceModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddService}
        />
      )}
      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSave={handleSaveService}
          onRemove={handleRemoveService}
        />
      )}
    </>
  );
}

export default ProviderDashboard;