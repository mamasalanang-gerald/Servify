import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useSavedServices } from '../contexts/SavedServicesContext';
import { toast } from '../hooks/use-toast';

const ViewService = ({ service, onBack }) => {
  const { unsaveService } = useSavedServices();

  // Safety checks - ensure we have valid data
  if (!service) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Service not found</h2>
          <Button onClick={onBack} className="bg-blue-600 text-white">Back to Services</Button>
        </div>
      </div>
    );
  }

  // Ensure packages exist
  const safePackages = Array.isArray(service.packages) && service.packages.length > 0
    ? service.packages
    : [
        {
          id: 'standard',
          label: 'Standard Service',
          price: service.basePrice || 0,
          duration: '2 hours',
          desc: service.description || 'Professional service',
        },
      ];

  const [selectedPackage, setSelectedPackage] = useState(safePackages[0]?.id || 'standard');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [isSaved, setIsSaved] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [userLocation, setUserLocation] = useState(service.location || 'San Diego, CA');
  const [note, setNote] = useState('');

  const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  
  // Find selected package safely
  const selectedPkg = safePackages.find((p) => p.id === selectedPackage) || safePackages[0];
  const platformFee = Math.round((selectedPkg?.price || 0) * 0.05);
  const total = (selectedPkg?.price || 0) + platformFee;

  const handleBook = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Missing Information',
        description: 'Please select a date and time',
        variant: 'destructive',
      });
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  const handleUnsave = async () => {
    try {
      const serviceId = service.id;
      await unsaveService(serviceId);
      setIsSaved(false);
      toast({
        title: 'Service Removed',
        description: 'Service removed from your saved list',
      });
      // Go back to saved services list after unsaving
      setTimeout(() => onBack(), 500);
    } catch (error) {
      console.error('Failed to unsave service:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove service. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`${i < Math.floor(rating) ? 'text-yellow-500' : i < rating ? 'text-yellow-400' : 'text-gray-300'} text-xl`}>★</span>
    ));

  // Safe data access
  const serviceTitle = service.title || 'Service';
  const serviceImage = service.img || '';
  const serviceCategory = service.category || 'Service';
  const serviceRating = service.rating || 4.5;
  const reviewCount = service.reviewCount || 0;
  const providerName = service.providerName || 'Service Provider';
  const providerAvatar = service.providerAvatar || 'SP';
  const providerJobs = service.providerJobs || 0;
  const providerJoined = service.providerJoined || new Date().getFullYear();
  const description = service.description || 'Professional service provider';
  const serviceLocation = service.location ;
  const safeIncludes = Array.isArray(service.includes) ? service.includes : ['Professional service', 'Quality guaranteed', 'On-time delivery'];
  const safeReviews = Array.isArray(service.reviews) ? service.reviews : [];

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Back Button */}
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
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
          <div className="relative h-[400px] rounded-2xl overflow-hidden group bg-slate-200 dark:bg-slate-800">
            {serviceImage ? (
              <img src={serviceImage} alt={serviceTitle} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <button 
              onClick={handleUnsave}
              className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isSaved ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <Badge className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-slate-700">
              {serviceCategory}
            </Badge>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">{serviceTitle}</h1>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                {renderStars(serviceRating)}
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{serviceRating}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">({reviewCount} reviews)</span>
              </div>
              <div className="text-lg text-slate-600 dark:text-slate-400">
                From <strong className="text-slate-900 dark:text-slate-100">₱{selectedPkg?.price || 0}</strong>
              </div>
            </div>

            {/* Provider Info */}
            <Card className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {providerAvatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {providerName}
                    <Badge variant="default" className="text-xs">Verified</Badge>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{providerJobs} jobs · Member since {providerJoined}</div>
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
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-6">
              {['description', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'reviews' && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {reviewCount}
                    </span>
                  )}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-8">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{description}</p>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {safeIncludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Choose a Package</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {safePackages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                          selectedPackage === pkg.id
                            ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {selectedPackage === pkg.id && (
                          <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                        <div className="font-bold text-slate-900 dark:text-slate-100 mb-2">{pkg.label}</div>
                        <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">₱{pkg.price || 0}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">{pkg.duration}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">{pkg.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-6">
                    <div className="text-5xl font-extrabold text-slate-900 dark:text-slate-100">{serviceRating}</div>
                    <div>
                      <div className="flex mb-2">{renderStars(serviceRating)}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Based on {reviewCount} reviews</div>
                    </div>
                  </div>
                </Card>

                {safeReviews.length > 0 ? (
                  <div className="space-y-4">
                    {safeReviews.map((r, i) => (
                      <Card key={i} className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                            {r.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{r.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{r.date}</div>
                          </div>
                          <div className="flex">{renderStars(r.rating)}</div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{r.text}</p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <div className="mb-6">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">₱{selectedPkg?.price || 0}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{selectedPkg?.label} · {selectedPkg?.duration}</div>
              </div>

              {bookingSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm font-medium">Booking confirmed! We'll send you a reminder.</span>
                </div>
              )}

              <form onSubmit={handleBook} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimes.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                          selectedTime === t
                            ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Service Location</label>
                  <input
                    type="text"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    placeholder="Enter your address/location"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Add a Note</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any special instructions or requests for the provider..."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">{note.length}/300</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Service fee</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">₱{selectedPkg?.price || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Platform fee (5%)</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">₱{platformFee}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-slate-100">Total</span>
                    <span className="text-slate-900 dark:text-slate-100">₱{total}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-br from-blue-900 to-blue-600 hover:opacity-90 text-white">
                  Book Now
                </Button>
                <p className="text-xs text-center text-slate-500 dark:text-slate-400">You won't be charged until the provider confirms.</p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewService;