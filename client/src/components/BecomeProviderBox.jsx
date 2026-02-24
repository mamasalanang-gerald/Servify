import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { categoryService } from '../services/categoryService';
import { validateApplicationForm } from '../utils/applicationValidation';
import { Input } from './ui/input';
import { Button } from './ui/button';

const BecomeProviderBox = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessName: '',
    bio: '',
    yearsOfExperience: '',
    serviceCategories: [],
    phoneNumber: '',
    serviceAddress: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if user already has an application on mount
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const status = await applicationService.getMyApplicationStatus();
        if (status && status.application) {
          // User already has an application
          setSubmitted(true);
          setForm(prev => ({
            ...prev,
            businessName: status.application.business_name || ''
          }));
        }
      } catch (err) {
        // No application found or error - that's okay, show the form
        console.log('No existing application found');
      } finally {
        setCheckingStatus(false);
      }
    };

    checkApplicationStatus();
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setForm(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(categoryId)
        ? prev.serviceCategories.filter(id => id !== categoryId)
        : [...prev.serviceCategories, categoryId]
    }));
    if (validationErrors.serviceCategories) {
      setValidationErrors({ ...validationErrors, serviceCategories: '' });
    }
  };

  const validateForm = () => {
    const errors = validateApplicationForm(form);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);
    try {
      await applicationService.submitApplication({
        businessName: form.businessName,
        bio: form.bio,
        yearsOfExperience: Number(form.yearsOfExperience),
        serviceCategories: form.serviceCategories,
        phoneNumber: form.phoneNumber,
        serviceAddress: form.serviceAddress,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-blue-700 p-12 lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-white">S</div>
            <span className="text-lg font-semibold text-white">Servify</span>
          </div>
          <div>
            <h2 className="mb-4 text-3xl font-bold text-white">You're almost there!</h2>
            <p className="text-blue-100 leading-relaxed">
              Your application is being reviewed by our admin team. We'll activate your provider account once approved.
            </p>
          </div>
          <p className="text-xs text-blue-200">&copy; {new Date().getFullYear()} Servify. All rights reserved.</p>
        </div>

        <div className="flex items-center justify-center bg-background p-6 sm:p-8">
          <div className="w-full max-w-[440px] text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="mb-3 text-3xl font-bold text-foreground">Application Submitted!</h1>
            <p className="mb-2 text-muted-foreground">
              Thank you, <span className="font-semibold text-foreground">{form.businessName}</span>!
            </p>
            <p className="mb-8 text-sm text-muted-foreground">
              Your provider application is now under review. Our admin team will verify your details and approve your account shortly.
            </p>
            <Button className="w-full" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            <p className="mt-4 text-xs text-muted-foreground">
              You can check your application status in your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking status
  if (checkingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <svg className="mx-auto h-8 w-8 animate-spin text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-sm text-muted-foreground">Checking application status...</p>
        </div>
      </div>
    );
  }

  // ── Main form ──
  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* Left blue card */}
      <div className="hidden flex-col justify-between bg-blue-700 p-12 lg:flex">
        <div className="flex items-center gap-3">
        </div>

        <div>
          <h2 className="mb-4 text-3xl font-bold text-white">Start earning with your skills.</h2>
          <p className="mb-8 text-blue-100 leading-relaxed">
            Register as a provider and connect with thousands of clients looking for your services. Your account will be reviewed and activated by our admin team.
          </p>
          <div className="space-y-4">
            {[
              { title: 'Free to join', desc: 'No hidden fees or monthly charges.' },
              { title: 'Admin verified', desc: 'All providers are reviewed for quality.' },
              { title: 'Secure payments', desc: 'Get paid safely and on time.' },
              { title: '24/7 support', desc: "We're here whenever you need help." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-blue-200">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-blue-200">&copy; {new Date().getFullYear()} Servify. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-8">
        <div className="w-full max-w-[440px]">

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Become a Provider</h1>
            <p className="text-sm text-muted-foreground">Fill in your details to submit your application.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Business Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Business Name *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <Input name="businessName" type="text" className="pl-10"
                  placeholder="Your Business Name" value={form.businessName} onChange={handleChange} />
              </div>
              {validationErrors.businessName && (
                <p className="text-xs text-red-600">{validationErrors.businessName}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Bio * <span className="text-xs text-muted-foreground">(minimum 50 characters)</span>
              </label>
              <textarea
                name="bio"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us about your experience and services..."
                value={form.bio}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">{form.bio.length}/50 characters</p>
              {validationErrors.bio && (
                <p className="text-xs text-red-600">{validationErrors.bio}</p>
              )}
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Years of Experience *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </span>
                <Input name="yearsOfExperience" type="number" min="0" className="pl-10"
                  placeholder="5" value={form.yearsOfExperience} onChange={handleChange} />
              </div>
              {validationErrors.yearsOfExperience && (
                <p className="text-xs text-red-600">{validationErrors.yearsOfExperience}</p>
              )}
            </div>

            {/* Service Categories */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Service Categories *</label>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border border-input rounded-md p-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.serviceCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
              {validationErrors.serviceCategories && (
                <p className="text-xs text-red-600">{validationErrors.serviceCategories}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <Input name="phoneNumber" type="tel" className="pl-10"
                  placeholder="+63 900 000 0000" value={form.phoneNumber} onChange={handleChange} />
              </div>
              {validationErrors.phoneNumber && (
                <p className="text-xs text-red-600">{validationErrors.phoneNumber}</p>
              )}
            </div>

            {/* Service Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Service Address *</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <textarea
                  name="serviceAddress"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Your service area address"
                  value={form.serviceAddress}
                  onChange={handleChange}
                />
              </div>
              {validationErrors.serviceAddress && (
                <p className="text-xs text-red-600">{validationErrors.serviceAddress}</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting application...
                </>
              ) : 'Submit Provider Application'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Sign in</a>
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              Admin Verified
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Secure Payments
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              24/7 Support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeProviderBox;