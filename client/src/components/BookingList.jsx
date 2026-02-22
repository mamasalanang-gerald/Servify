  import React, { useState } from 'react';
  import BookingCard from './BookingCard';
  import { Card } from './ui/card';
  import { Button } from './ui/button';
  import { cn } from '../lib/utils';

  import houseCleaningImg from '../assets/images/house_cleaning.jpg'
  import spaImg from '../assets/images/spa_massage.jpg'
  import plumbingImg from '../assets/images/plumbing_repair.jpg'
  import computerImg from '../assets/images/computer_repair.jpg'
  import mathImg from '../assets/images/math_physics.jpg'
  import webImg from '../assets/images/professional_web_design.png'

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
      <Card className="p-6">
        <div className="mb-6 flex gap-2 border-b border-border">
          {['Upcoming', 'History'].map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              className={cn(
                "relative rounded-none border-b-2 px-4 py-2",
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </Card>
    );
  };

  export default BookingList;
