<<<<<<< Updated upstream
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
=======
import houseCleaningImg from "../assets/images/house_cleaning.jpg";
import plumbingImg from "../assets/images/plumbing_repair.jpg";
import spaImg from "../assets/images/spa_massage.jpg";
import mathImg from "../assets/images/math_physics.jpg";
import computerRepairImg from "../assets/images/computer_repair.jpg";
import webDesignImg from "../assets/images/professional_web_design.png";

const services = [
  { id: 1, title: "Deep Home Cleaning", category: "Home Cleaning", provider: "Maria Santos", initials: "MS", jobs: "142 jobs", rating: 4.9, price: "$49", img: houseCleaningImg },
  { id: 2, title: "Pipe Repair & Installation", category: "Plumbing", provider: "Jake Rivera", initials: "JR", jobs: "98 jobs", rating: 4.7, price: "$79", img: plumbingImg },
  { id: 3, title: "Full Body Spa Treatment", category: "Beauty & Spa", provider: "Lily Chen", initials: "LC", jobs: "210 jobs", rating: 5.0, price: "$89", img: spaImg },
  { id: 4, title: "Math & Science Tutoring", category: "Tutoring", provider: "Dr. Amos", initials: "DA", jobs: "317 jobs", rating: 4.8, price: "$35", img: mathImg },
  { id: 5, title: "Appliance Repair", category: "Repairs", provider: "Tom Cruz", initials: "TC", jobs: "76 jobs", rating: 4.6, price: "$59", img: computerRepairImg },
  { id: 6, title: "Website Development", category: "Digital Services", provider: "Sia Reyes", initials: "SR", jobs: "183 jobs", rating: 4.9, price: "$120", img: webDesignImg },
];

export default function ServicesGrid({ searchQuery }) {
  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
    s.category.toLowerCase().includes((searchQuery || "").toLowerCase())
>>>>>>> Stashed changes
  );

  return (
    <div className="services-grid-wrapper">
<<<<<<< Updated upstream
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
=======
      <p className="services-grid__count">{filtered.length} services found</p>
      <div className="services-grid">
        {filtered.length === 0 ? (
          <p className="services-grid__empty">No services match your search.</p>
        ) : (
          filtered.map((s) => (
            <div key={s.id} className="service-card">
              <div className="service-card__img-wrapper">
                <img src={s.img} alt={s.title} className="service-card__img" />
                <span className="service-card__rating">⭐ {s.rating}</span>
                <span className="service-card__category">{s.category}</span>
              </div>
              <div className="service-card__body">
                <p className="service-card__title">{s.title}</p>
                <div className="service-card__provider">
                  <div className="service-card__provider-avatar">{s.initials}</div>
                  <div>
                    <p className="service-card__provider-name">{s.provider}</p>
                    <p className="service-card__jobs">{s.jobs}</p>
                  </div>
                </div>
                <div className="service-card__footer">
                  <div>
                    <p className="service-card__starting">Starting at</p>
                    <p className="service-card__price">{s.price}</p>
                  </div>
                  <button className="service-card__btn">Book Now</button>
                </div>
              </div>
            </div>
          ))
>>>>>>> Stashed changes
        )}
      </div>
    </div>
  );
<<<<<<< Updated upstream
};

export default ServicesGrid;
=======
}
>>>>>>> Stashed changes
