import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

const ViewService = ({ service, onBack }) => {
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [selectedDate, setSelectedDate]       = useState('');
  const [selectedTime, setSelectedTime]       = useState('');
  const [activeTab, setActiveTab]             = useState('overview');
  const [isSaved, setIsSaved]                 = useState(true);
  const [bookingSuccess, setBookingSuccess]   = useState(false);

  const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const selectedPkg    = service.packages.find((p) => p.id === selectedPackage);
  const platformFee    = Math.round(selectedPkg.price * 0.05);
  const total          = selectedPkg.price + platformFee;

  const handleBook = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`${i < Math.floor(rating) ? 'text-yellow-500' : i < rating ? 'text-yellow-400' : 'text-gray-300'} text-xl`}>★</span>
    ));

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* Back Button */}
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Saved Services
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-[1280px] mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden group">
            <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isSaved ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:bg-white'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <Badge className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-blue-600 border border-blue-100">
              {service.category}
            </Badge>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{service.title}</h1>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                {renderStars(service.rating)}
                <span className="text-lg font-bold text-slate-900">{service.rating}</span>
                <span className="text-sm text-slate-500">({service.reviewCount} reviews)</span>
              </div>
              <div className="text-lg text-slate-600">
                From <strong className="text-slate-900">₱{service.basePrice}</strong>
              </div>
            </div>

            {/* Provider Info */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {service.providerAvatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    {service.providerName}
                    <Badge variant="default" className="text-xs">Verified</Badge>
                  </div>
                  <div className="text-sm text-slate-500">{service.providerJobs} jobs · Member since {service.providerJoined}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Tabs + Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 mb-6">
              {['overview', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'reviews' && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                      {service.reviewCount}
                    </span>
                  )}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <p className="text-slate-700 leading-relaxed">{service.description}</p>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Choose a Package</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {service.packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                          selectedPackage === pkg.id
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {selectedPackage === pkg.id && (
                          <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                        <div className="font-bold text-slate-900 mb-2">{pkg.label}</div>
                        <div className="text-2xl font-extrabold text-blue-600 mb-1">₱{pkg.price}</div>
                        <div className="text-sm text-slate-500 mb-3">{pkg.duration}</div>
                        <div className="text-sm text-slate-600">{pkg.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-5xl font-extrabold text-slate-900">{service.rating}</div>
                    <div>
                      <div className="flex mb-2">{renderStars(service.rating)}</div>
                      <div className="text-sm text-slate-500">Based on {service.reviewCount} reviews</div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  {service.reviews.map((r, i) => (
                    <Card key={i} className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                          {r.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{r.name}</div>
                          <div className="text-sm text-slate-500">{r.date}</div>
                        </div>
                        <div className="flex">{renderStars(r.rating)}</div>
                      </div>
                      <p className="text-slate-700">{r.text}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 p-6">
              <div className="mb-6">
                <div className="text-3xl font-extrabold text-slate-900 mb-1">₱{selectedPkg.price}</div>
                <div className="text-sm text-slate-500">{selectedPkg.label} · {selectedPkg.duration}</div>
              </div>

              {bookingSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm font-medium">Booking confirmed! We'll send you a reminder.</span>
                </div>
              )}

              <form onSubmit={handleBook} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Select Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Select Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimes.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                          selectedTime === t
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Service fee</span>
                    <span className="font-medium text-slate-900">₱{selectedPkg.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Platform fee (5%)</span>
                    <span className="font-medium text-slate-900">₱{platformFee}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-200">
                    <span className="text-slate-900">Total</span>
                    <span className="text-slate-900">₱{total}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-br from-blue-900 to-blue-600 hover:opacity-90">
                  Book Now
                </Button>
                <p className="text-xs text-center text-slate-500">You won't be charged until the provider confirms.</p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewService;
