import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const initialReviews = [
  { id: 1, client: 'Maria Santos',  avatar: 'MS', service: 'Deep House Cleaning', rating: 5, date: 'Feb 18, 2026', text: 'Absolutely fantastic! The team was thorough and professional. My kitchen looks brand new. Will definitely book again!', reply: '' },
  { id: 2, client: 'James Torres',  avatar: 'JT', service: 'Move-In/Out Clean',   rating: 5, date: 'Feb 15, 2026', text: 'Highly recommend. Punctual, efficient, and left zero mess behind. Juan is the best cleaner in the area.', reply: 'Thank you so much James! It was a pleasure working with you.' },
  { id: 3, client: 'Lena Macaraeg', avatar: 'LM', service: 'Standard Clean',      rating: 4, date: 'Feb 10, 2026', text: 'Great service overall. Minor thing was they missed one shelf, but everything else was perfect.', reply: '' },
  { id: 4, client: 'Ana Reyes',     avatar: 'AR', service: 'Standard Clean',      rating: 5, date: 'Jan 28, 2026', text: 'Super thorough and friendly! My apartment smells amazing now. Great value for the price.', reply: 'Thank you Ana! So happy you loved the results.' },
  { id: 5, client: 'Paul Katigbak', avatar: 'PK', service: 'Deep House Cleaning', rating: 4, date: 'Jan 22, 2026', text: 'Very good service, arrived on time and was professional throughout. Would recommend to friends.', reply: '' },
  { id: 6, client: 'Sofia Araneta', avatar: 'SA', service: 'Move-In/Out Clean',   rating: 5, date: 'Jan 15, 2026', text: 'Saved my security deposit! The apartment was spotless when they were done. Worth every peso.', reply: '' },
];

const ratingCounts = [5, 4, 3, 2, 1].map((n) => ({
  star: n,
  count: initialReviews.filter((r) => r.rating === n).length,
}));

const avgRating = (initialReviews.reduce((s, r) => s + r.rating, 0) / initialReviews.length).toFixed(1);

const renderStars = (n, size = 'text-base') =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`${i < n ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} ${size}`}>★</span>
  ));

const ProviderReviews = () => {
  const [reviewList, setReviewList] = useState(initialReviews);
  const [replyDraft, setReplyDraft] = useState({});
  const [filter, setFilter]         = useState(0);

  const submitReply = (id) => {
    if (!replyDraft[id]?.trim()) return;
    setReviewList(reviewList.map((r) => r.id === id ? { ...r, reply: replyDraft[id] } : r));
    setReplyDraft({ ...replyDraft, [id]: '' });
  };

  const filtered = filter === 0 ? reviewList : reviewList.filter((r) => r.rating === filter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left: summary + filter */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">{avgRating}</div>
            <div className="flex mb-2">{renderStars(Math.round(avgRating), 'text-xl')}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{initialReviews.length} reviews</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filter by Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                filter === 0
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setFilter(0)}
            >
              <span className="text-sm font-medium">All Reviews</span>
              <span className="text-sm font-semibold">{initialReviews.length}</span>
            </button>
            {ratingCounts.map(({ star, count }) => (
              <button
                key={star}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  filter === star
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setFilter(star)}
              >
                <span className="text-sm font-medium min-w-[30px]">{star}★</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full" 
                    style={{ width: `${(count / initialReviews.length) * 100}%` }} 
                  />
                </div>
                <span className="text-sm font-semibold min-w-[20px] text-right">{count}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right: review cards */}
      <div className="lg:col-span-3 space-y-4">
        {filtered.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-4xl mb-3">⭐</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">No reviews for this rating</div>
            </CardContent>
          </Card>
        )}

        {filtered.map((r) => (
          <Card key={r.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
                  {r.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{r.client}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{r.service} · {r.date}</div>
                </div>
                <div className="flex">{renderStars(r.rating, 'text-sm')}</div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{r.text}</p>

              {r.reply && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Your Reply</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{r.reply}</p>
                </div>
              )}

              {!r.reply && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Write a reply..."
                    value={replyDraft[r.id] || ''}
                    onChange={(e) => setReplyDraft({ ...replyDraft, [r.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && submitReply(r.id)}
                  />
                  <Button size="sm" variant="outline" onClick={() => submitReply(r.id)}>Reply</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProviderReviews;
