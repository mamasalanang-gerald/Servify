import { useState } from 'react';
import BookingCard from './BookingCard';

import houseCleaningImg from '../assets/images/house_cleaning.jpg'
import spaImg from '../assets/images/spa_massage.jpg'
import plumbingImg from '../assets/images/plumbing_repair.jpg'
import mathImg from '../assets/images/math_physics.jpg'

const upcomingBookings = [
  {
    id: 1,
    img: houseCleaningImg,
    title: 'Deep House Cleaning',
    subtitle: 'Standard Clean',
    date: '2/20/2026',
    status: 'upcoming',
    total: '₱149',
  },
  {
    id: 2,
    img: spaImg,
    title: 'Luxury Spa & Massage',
    subtitle: 'Express Massage',
    date: '2/25/2026',
    status: 'upcoming',
    total: '₱120',
  },
];

const historyBookings = [
  {
    id: 3,
    img: plumbingImg,
    title: 'Emergency Plumbing Repair',
    subtitle: 'Pipe Fix',
    date: '1/10/2026',
    status: 'completed',
    total: '₱200',
  },
  {
    id: 4,
    img: mathImg,
    title: 'Math & Physics Tutoring',
    subtitle: 'Full Session',
    date: '1/5/2026',
    status: 'completed',
    total: '₱150',
  },
];

const BookingList = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const bookings = activeTab === 'Upcoming' ? upcomingBookings : historyBookings;

  return (
    <div className="booking-list">
      <div className="booking-list__tabs">
        {['Upcoming', 'History'].map((tab) => (
          <button
            key={tab}
            className={`booking-list__tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="booking-list__items">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingList;