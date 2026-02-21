import React, { useState } from 'react';
import '../pages/styles/ProviderReviews.css';

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

const renderStars = (n, size = '1rem') =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < n ? '#f59e0b' : '#d1d5db', fontSize: size }}>★</span>
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
    <div className="reviews-wrapper">
      <div className="reviews-layout">
        {/* Left: summary + filter */}
        <div className="reviews-aside">
          <div className="p-card reviews-summary">
            <div className="reviews-summary__big">{avgRating}</div>
            <div className="reviews-summary__stars">{renderStars(Math.round(avgRating), '1.3rem')}</div>
            <div className="reviews-summary__count">{initialReviews.length} reviews</div>
          </div>

          <div className="p-card reviews-filter">
            <h3 className="reviews-filter__title">Filter by Rating</h3>
            <button
              className={`reviews-filter__all ${filter === 0 ? 'active' : ''}`}
              onClick={() => setFilter(0)}
            >
              <span>All Reviews</span>
              <span>{initialReviews.length}</span>
            </button>
            {ratingCounts.map(({ star, count }) => (
              <button
                key={star}
                className={`reviews-filter__row ${filter === star ? 'active' : ''}`}
                onClick={() => setFilter(star)}
              >
                <span className="reviews-filter__star">{star}★</span>
                <div className="reviews-filter__bar">
                  <div className="reviews-filter__fill" style={{ width: `${(count / initialReviews.length) * 100}%` }} />
                </div>
                <span className="reviews-filter__num">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: review cards */}
        <div className="reviews-list">
          {filtered.length === 0 && (
            <div className="p-empty">
              <div className="p-empty__icon">⭐</div>
              <div className="p-empty__text">No reviews for this rating</div>
            </div>
          )}

          {filtered.map((r) => (
            <div key={r.id} className="review-card p-card">
              <div className="review-card__header">
                <div className="review-card__avatar">{r.avatar}</div>
                <div className="review-card__meta">
                  <div className="review-card__name">{r.client}</div>
                  <div className="review-card__sub">{r.service} · {r.date}</div>
                </div>
                <div className="review-card__stars">{renderStars(r.rating, '0.9rem')}</div>
              </div>

              <p className="review-card__text">{r.text}</p>

              {r.reply && (
                <div className="review-card__reply">
                  <div className="review-card__reply-label">Your Reply</div>
                  <p className="review-card__reply-text">{r.reply}</p>
                </div>
              )}

              {!r.reply && (
                <div className="review-card__reply-input">
                  <input
                    className="p-form__input"
                    placeholder="Write a reply..."
                    value={replyDraft[r.id] || ''}
                    onChange={(e) => setReplyDraft({ ...replyDraft, [r.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && submitReply(r.id)}
                  />
                  <button className="p-btn p-btn--ghost p-btn--sm" onClick={() => submitReply(r.id)}>Reply</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderReviews;