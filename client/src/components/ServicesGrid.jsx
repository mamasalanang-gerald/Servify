import React from 'react';
import ServiceCard from './ServiceCard';

import houseCleaningImg from '../assets/images/house_cleaning.jpg';
import plumbingImg from '../assets/images/plumbing_repair.jpg';
import spaImg from '../assets/images/spa_massage.jpg';
import mathImg from '../assets/images/math_physics.jpg';
import computerImg from '../assets/images/computer_repair.jpg';
import webImg from '../assets/images/professional_web_design.png';

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
    price: '₱89',
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
    price: '₱75',
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
    price: '₱120',
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
    price: '₱60',
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
    price: '₱50',
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
    price: '₱500',
  },
];

const ServicesGrid = ({ searchQuery }) => {
  const filtered = allServices.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="services-grid-wrapper">
      <p className="services-grid__count">{filtered.length} services available</p>
      <div className="services-grid">
        {filtered.length > 0 ? (
          filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        ) : (
          <div className="services-grid__empty">
            <p>No services found for "<strong>{searchQuery}</strong>"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesGrid;