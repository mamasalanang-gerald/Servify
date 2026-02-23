import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Input } from './ui/input';
import { Button } from './ui/button';

const BecomeProviderBox = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim()) return setError('Full name is required.');
    if (!form.email.trim()) return setError('Email is required.');
    if (!form.phone.trim()) return setError('Contact number is required.');

    setLoading(true);
    try {
      await authService.registerProvider({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
              Thank you, <span className="font-semibold text-foreground">{form.fullName}</span>!
            </p>
            <p className="mb-8 text-sm text-muted-foreground">
              Your provider application is now under review. Our admin team will verify your details and approve your account shortly.
            </p>
            <Button className="w-full" onClick={() => navigate('/login')}>Go to Login</Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Already approved?{' '}
              <a href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Sign in here</a>
            </p>
          </div>
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

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <Input name="fullName" type="text" className="pl-10"
                  placeholder="Juan dela Cruz" value={form.fullName} onChange={handleChange} required />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <Input name="email" type="email" className="pl-10"
                  placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Contact Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <Input name="phone" type="tel" className="pl-10"
                  placeholder="+63 900 000 0000" value={form.phone} onChange={handleChange} required />
              </div>
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