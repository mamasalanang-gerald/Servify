import ServiceCard from './ServiceCard';

import houseCleaningImg from '../assets/images/house_cleaning.jpg';
import plumbingImg from '../assets/images/plumbing_repair.jpg';
import spaImg from '../assets/images/spa_massage.jpg';
import mathImg from '../assets/images/math_physics.jpg';
import computerImg from '../assets/images/computer_repair.jpg';
import webImg from '../assets/images/professional_web_design.png';
import movingImg from '../assets/images/moving.jpg';
import petCareImg from '../assets/images/pet_care.jpg';

const allServices = [
  {
    id: 1,
    img: houseCleaningImg,
    category: 'Home Cleaning',
    title: 'Deep House Cleaning',
    rating: 4.9,
    providerName: 'Chris Izeq Delos Santos',
    providerInitial: 'CI',
    jobs: 342,
    priceNum: 2800,
    price: '₱2,800',
    description: 'Professional deep cleaning service for your entire home. Our team uses eco-friendly products and advanced cleaning techniques to ensure every corner sparkles. Perfect for move-ins, move-outs, or seasonal deep cleans.',
  },
  {
    id: 2,
    img: plumbingImg,
    category: 'Plumbing',
    title: 'Emergency Plumbing Repair',
    rating: 4.8,
    providerName: 'Jerry Sayo',
    providerInitial: 'JS',
    jobs: 528,
    priceNum: 4500,
    price: '₱4,500',
    description: 'Expert plumbing repair and installation services. From leaky faucets to full pipe replacements, we handle it all with fast response times and quality workmanship.',
  },
  {
    id: 3,
    img: spaImg,
    category: 'Beauty & Spa',
    title: 'Luxury Spa & Massage',
    rating: 5.0,
    providerName: 'Angelo Esguerra',
    providerInitial: 'AE',
    jobs: 187,
    priceNum: 5000,
    price: '₱5,000',
    description: 'Indulge in a luxurious full body spa experience. Our certified therapists provide relaxing treatments tailored to your needs, using premium natural products.',
  },
  {
    id: 4,
    img: mathImg,
    category: 'Tutoring',
    title: 'Math & Physics Tutoring',
    rating: 4.9,
    providerName: 'Benjamin Balilla',
    providerInitial: 'BB',
    jobs: 412,
    priceNum: 1500,
    price: '₱1,500',
    description: 'Experienced tutor specializing in high school and university level Math and Science. Personalized sessions that build real understanding and confidence.',
  },
  {
    id: 5,
    img: computerImg,
    category: 'Repairs',
    title: 'Computer & Electronics Repair',
    rating: 4.7,
    providerName: 'Bong Sali',
    providerInitial: 'BS',
    jobs: 634,
    priceNum: 3500,
    price: '₱3,500',
    description: 'Fast, reliable repair for all major appliance and electronics brands. Diagnosed and fixed on the same day.',
  },
  {
    id: 6,
    img: webImg,
    category: 'Digital Services',
    title: 'Professional Web Design',
    rating: 4.9,
    providerName: 'Roger Dy',
    providerInitial: 'RD',
    jobs: 156,
    priceNum: 15000,
    price: '₱15,000',
    description: 'Full-stack web development tailored to your business. Modern, responsive, and SEO-optimized websites built with React, Next.js, and more.',
  },
  {
    id: 7,
    img: movingImg,
    category: 'Moving',
    title: 'Local Home Moving',
    rating: 4.8,
    providerName: 'Ben Marcos',
    providerInitial: 'BM',
    jobs: 54,
    priceNum: 8000,
    price: '₱8,000',
    description: 'Stress-free local moving service handled by a professional crew. We carefully pack, load, transport, and unload your belongings so you can focus on settling in.',
  },
  {
    id: 8,
    img: petCareImg,
    category: 'Pet Care',
    title: 'Dog Walking & Pet Sitting',
    rating: 4.9,
    providerName: 'Chloe Park',
    providerInitial: 'CP',
    jobs: 201,
    priceNum: 1200,
    price: '₱1,200',
    description: "Reliable, loving care for your pets while you're away. Daily walks, feeding, playtime, and updates so you always know your furry friend is happy and safe.",
  },
];

const ratingThresholds = {
  '4.5+ Stars': (r) => r >= 4.5,
  '4+ Stars':   (r) => r >= 4,
  '3.5+ Stars': (r) => r >= 3.5,
  '3& below':   (r) => r <= 3,
};

const ServicesGrid = ({ searchQuery, filters, onSelectService }) => {
  const { priceRange, selectedRating, selectedCategories } = filters;

  const filtered = allServices.filter((s) => {
    // Search
    const q = (searchQuery || '').toLowerCase();
    if (q && !s.title.toLowerCase().includes(q) && !s.category.toLowerCase().includes(q)) return false;

    // Price
    if (s.priceNum > priceRange) return false;

    // Categories (if any checked)
    if (selectedCategories.length > 0 && !selectedCategories.includes(s.category)) return false;

    // Rating
    if (selectedRating && ratingThresholds[selectedRating] && !ratingThresholds[selectedRating](s.rating)) return false;

    return true;
  });

  return (
    <div className="services-grid-wrapper">
      <p className="services-grid__count">{filtered.length} services available</p>
      <div className="services-grid">
        {filtered.length > 0 ? (
          filtered.map((service) => (
            <div
              key={service.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectService(service)}
            >
              <ServiceCard service={service} />
            </div>
          ))
        ) : (
          <div className="services-grid__empty">
            <p>No services match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesGrid;