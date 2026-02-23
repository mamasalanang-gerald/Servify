import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import houseCleaningImg from '../assets/images/house_cleaning.jpg';
import plumbingImg from '../assets/images/plumbing_repair.jpg';
import spaImg from '../assets/images/spa_massage.jpg';
import mathImg from '../assets/images/math_physics.jpg';
import ViewService from './ViewService';

const savedServices = [
  {
    id: 1,
    img: houseCleaningImg,
    title: 'Deep House Cleaning',
    rating: 4.9,
    price: '₱89',
    basePrice: 89,
    category: 'Cleaning',
    reviewCount: 128,
    providerName: 'CleanPro Services',
    providerAvatar: 'CP',
    providerJoined: 'March 2021',
    providerJobs: 340,
    description: 'Experience a spotless home with our professional deep cleaning service. Our trained staff uses eco-friendly products and proven techniques to tackle every corner — from baseboards to ceiling fans — leaving your space fresh, sanitized, and immaculate.',
    includes: ['Full kitchen deep clean (appliances, cabinets, countertops)', 'Bathroom scrub & disinfection', 'Vacuuming & mopping all floors', 'Dusting — furniture, shelves, ceiling fans', 'Window sills & door frames', 'Trash removal & linen change (optional)'],
    packages: [
      { id: 'basic',    label: 'Basic',    price: 89,  duration: '3 hrs', desc: 'Living areas + 1 bathroom' },
      { id: 'standard', label: 'Standard', price: 149, duration: '5 hrs', desc: 'Full home up to 3 bedrooms' },
      { id: 'premium',  label: 'Premium',  price: 229, duration: '8 hrs', desc: 'Deep clean entire property' },
    ],
    reviews: [
      { name: 'Maria S.', avatar: 'MS', rating: 5, date: 'Jan 12, 2025', text: 'Absolutely fantastic! The team was thorough and professional. My kitchen looks brand new.' },
      { name: 'James T.', avatar: 'JT', rating: 5, date: 'Dec 28, 2024', text: 'Highly recommend. Punctual, efficient, and left zero mess behind. Will book again.' },
      { name: 'Ana R.',   avatar: 'AR', rating: 4, date: 'Dec 10, 2024', text: 'Great service overall. Minor thing was they missed one shelf, but everything else was perfect.' },
    ],
  },
  {
    id: 2,
    img: plumbingImg,
    title: 'Emergency Plumbing Repair',
    rating: 4.8,
    price: '₱75',
    basePrice: 75,
    category: 'Plumbing',
    reviewCount: 95,
    providerName: 'QuickFix Plumbing',
    providerAvatar: 'QF',
    providerJoined: 'June 2020',
    providerJobs: 512,
    description: 'Fast, reliable emergency plumbing available 24/7. From burst pipes to blocked drains, our licensed plumbers arrive within the hour and fix the issue right the first time.',
    includes: ['Pipe leak detection & repair', 'Drain unblocking', 'Fixture installation & replacement', 'Water pressure diagnostics', 'Emergency shutoff valve service', 'Post-repair cleanup'],
    packages: [
      { id: 'basic',    label: 'Basic',    price: 75,  duration: '1 hr',  desc: 'Single issue, standard hours' },
      { id: 'standard', label: 'Standard', price: 130, duration: '2 hrs', desc: 'Multiple issues or emergency' },
      { id: 'premium',  label: 'Premium',  price: 200, duration: '4 hrs', desc: 'Full plumbing inspection + repair' },
    ],
    reviews: [
      { name: 'Rico B.', avatar: 'RB', rating: 5, date: 'Feb 3, 2025',  text: 'Arrived in 45 minutes! Fixed our burst pipe quickly. Absolute lifesavers.' },
      { name: 'Lena M.', avatar: 'LM', rating: 4, date: 'Jan 20, 2025', text: 'Professional and efficient. Slight delay but the work quality was excellent.' },
    ],
  },
  {
    id: 3,
    img: spaImg,
    title: 'Luxury Spa & Massage',
    rating: 5.0,
    price: '₱120',
    basePrice: 120,
    category: 'Wellness',
    reviewCount: 74,
    providerName: 'Zen Touch Wellness',
    providerAvatar: 'ZT',
    providerJoined: 'January 2022',
    providerJobs: 189,
    description: 'Unwind with a professional relaxation massage tailored to your needs. Our certified therapists use Swedish and deep-tissue techniques to melt away tension and restore balance.',
    includes: ['Full-body Swedish massage', 'Aromatherapy oils', 'Hot towel treatment', 'Pressure point therapy', 'Personalized pressure preference', 'Post-session hydration tips'],
    packages: [
      { id: 'basic',    label: 'Basic',    price: 120, duration: '45 min', desc: 'Back & shoulders focus' },
      { id: 'standard', label: 'Standard', price: 180, duration: '60 min', desc: 'Full body relaxation' },
      { id: 'premium',  label: 'Premium',  price: 250, duration: '90 min', desc: 'Full body + aromatherapy' },
    ],
    reviews: [
      { name: 'Sofia A.', avatar: 'SA', rating: 5, date: 'Jan 30, 2025', text: "Best massage I've had in years. So relaxing and professional." },
      { name: 'Marco D.', avatar: 'MD', rating: 4, date: 'Dec 15, 2024', text: 'Very calming experience. The therapist was attentive and skilled.' },
    ],
  },
  {
    id: 4,
    img: mathImg,
    title: 'Math & Physics Tutoring',
    rating: 4.9,
    price: '₱60',
    basePrice: 60,
    category: 'Education',
    reviewCount: 53,
    providerName: 'BrightMind Tutors',
    providerAvatar: 'BM',
    providerJoined: 'September 2021',
    providerJobs: 230,
    description: 'One-on-one math and physics tutoring for all levels — from elementary arithmetic to university calculus. Our expert tutors adapt to your learning pace and build real understanding, not just test scores.',
    includes: ['Personalized learning plan', 'Concept explanations + practice problems', 'Homework & exam help', 'Progress tracking report', 'Session notes & resources', 'Online or in-person options'],
    packages: [
      { id: 'basic',    label: 'Basic',    price: 60,  duration: '1 hr',  desc: 'Single session' },
      { id: 'standard', label: 'Standard', price: 220, duration: '4 hrs', desc: '4-session bundle' },
      { id: 'premium',  label: 'Premium',  price: 400, duration: '8 hrs', desc: '8-session bundle + plan' },
    ],
    reviews: [
      { name: 'Trisha C.', avatar: 'TC', rating: 5, date: 'Feb 10, 2025', text: "My daughter's grades improved from failing to B+ in just 6 sessions. Incredible!" },
      { name: 'Paul K.',   avatar: 'PK', rating: 5, date: 'Jan 5, 2025',  text: 'Very patient and explains concepts clearly. Highly recommended for university students.' },
    ],
  },
];

const SavedServices = () => {
  const [viewingService, setViewingService] = useState(null);

  if (viewingService) {
    return <ViewService service={viewingService} onBack={() => setViewingService(null)} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Saved Services</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedServices.map((service) => (
          <Card key={service.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative">
              <img src={service.img} alt={service.title} className="h-48 w-full object-cover" />
              <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white" aria-label="Remove from saved">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground">{service.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {service.rating}
                </span>
                <span>•</span>
                <span>From {service.price}</span>
              </div>
              <Button className="w-full" onClick={() => setViewingService(service)}>
                View Service
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedServices;