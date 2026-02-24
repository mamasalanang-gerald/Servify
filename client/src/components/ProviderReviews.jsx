import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { serviceService } from '../services/serviceService';
import { authService } from '../services/authService';

const renderStars = (n, size = 'text-base') =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`${i < n ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} ${size}`}>★</span>
  ));

const ProviderReviews = () => {
  const [reviewList, setReviewList] = useState([]);
  const [replyDraft, setReplyDraft] = useState({});
  const [filter, setFilter]         = useState(0);

  useEffect(() => {
    const user = authService.getUser();
    if (user?.id) {
      serviceService.getMyServices().then(async (services) => {
        const data = Array.isArray(services) ? services : [];
        const allReviews = [];
        for (const svc of data) {
          try {
            const reviews = await serviceService.getServiceReviews(svc.id);
            allReviews.push(...reviews.map((r) => ({ ...r, service: svc.title })));
          } catch (e) { /* skip */ }
        }
        setReviewList(allReviews);
      }).catch(console.error);
    }
  }, []);

  const ratingCounts = [5, 4, 3, 2, 1].map((n) => ({
    star: n,
    count: reviewList.filter((r) => r.rating === n).length,
  }));

  const avgRating = reviewList.length > 0
    ? (reviewList.reduce((s, r) => s + r.rating, 0) / reviewList.length).toFixed(1)
    : '0.0';

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
            <div className="text-sm text-gray-600 dark:text-gray-400">{reviewList.length} reviews</div>
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
              <span className="text-sm font-semibold">{reviewList.length}</span>
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
                    style={{ width: `${reviewList.length > 0 ? (count / reviewList.length) * 100 : 0}%` }} 
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
                  {(r.reviewer_name || r.client || '?')[0]}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{r.reviewer_name || r.client}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {r.service} · {new Date(r.review_date || r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex">{renderStars(r.rating, 'text-sm')}</div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{r.comment || r.text}</p>

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
