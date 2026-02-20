<<<<<<< Updated upstream
import React, { useState } from 'react';

const categories = [
  { name: 'Home Cleaning', count: 234 },
  { name: 'Plumbing', count: 156 },
  { name: 'Beauty & Spa', count: 189 },
  { name: 'Tutoring', count: 298 },
  { name: 'Repairs', count: 145 },
  { name: 'Digital Services', count: 312 },
  { name: 'Moving', count: 87 },
  { name: 'Pet Care', count: 124 },
];

const ratings = ['4.5+ Stars', '4+ Stars', '3.5+ Stars', '3+ Stars'];

const ServicesFilter = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState(500);
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (cat) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
    onFilterChange?.({ priceRange, selectedRating, selectedCategories: updated });
  };

  const clearAll = () => {
    setPriceRange(500);
    setSelectedRating('');
    setSelectedCategories([]);
    onFilterChange?.({ priceRange: 500, selectedRating: '', selectedCategories: [] });
=======
import { useState } from "react";

const categories = [
  { label: "Home Cleaning", count: 234 },
  { label: "Plumbing", count: 156 },
  { label: "Beauty & Spa", count: 189 },
  { label: "Tutoring", count: 298 },
  { label: "Repairs", count: 145 },
  { label: "Digital Services", count: 312 },
];

const ratings = ["Any", "4★ & up", "3★ & up"];

export default function ServicesFilter({ onFilter }) {
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState("Any");

  const handleClear = () => {
    setMaxPrice(500);
    setSelectedCategory("");
    setSelectedRating("Any");
>>>>>>> Stashed changes
  };

  return (
    <aside className="services-filter">
      <div className="services-filter__header">
<<<<<<< Updated upstream
        <h3 className="services-filter__title">Filters</h3>
        <button className="services-filter__clear" onClick={clearAll}>Clear All</button>
      </div>

      {/* Price Range */}
      <div className="services-filter__section">
        <h4 className="services-filter__label">Price Range</h4>
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="services-filter__slider"
        />
        <div className="services-filter__price-labels">
          <span>₱0</span>
          <span>₱{priceRange === 500 ? '500+' : priceRange}</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="services-filter__section">
        <h4 className="services-filter__label">Minimum Rating</h4>
        <div className="services-filter__options">
          {ratings.map((rating) => (
            <label key={rating} className="services-filter__option">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
                className="services-filter__radio"
              />
              <span>{rating}</span>
=======
        <span className="services-filter__title">Filters</span>
        <button className="services-filter__clear" onClick={handleClear}>Clear all</button>
      </div>

      {/* Price */}
      <div className="services-filter__section">
        <p className="services-filter__label">Max Price</p>
        <input
          type="range"
          min={10}
          max={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="services-filter__slider"
        />
        <div className="services-filter__price-labels">
          <span>$10</span>
          <span>${maxPrice}</span>
        </div>
      </div>

      {/* Category */}
      <div className="services-filter__section">
        <p className="services-filter__label">Category</p>
        <div className="services-filter__options">
          {categories.map((cat) => (
            <label key={cat.label} className="services-filter__option">
              <input
                type="radio"
                name="category"
                className="services-filter__radio"
                checked={selectedCategory === cat.label}
                onChange={() => setSelectedCategory(cat.label)}
              />
              {cat.label}
              <span className="services-filter__count">({cat.count})</span>
>>>>>>> Stashed changes
            </label>
          ))}
        </div>
      </div>

<<<<<<< Updated upstream
      {/* Categories */}
      <div className="services-filter__section">
        <h4 className="services-filter__label">Categories</h4>
        <div className="services-filter__options">
          {categories.map((cat) => (
            <label key={cat.name} className="services-filter__option">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
                className="services-filter__checkbox"
              />
              <span>{cat.name} <span className="services-filter__count">({cat.count})</span></span>
=======
      {/* Rating */}
      <div className="services-filter__section">
        <p className="services-filter__label">Rating</p>
        <div className="services-filter__options">
          {ratings.map((r) => (
            <label key={r} className="services-filter__option">
              <input
                type="radio"
                name="rating"
                className="services-filter__radio"
                checked={selectedRating === r}
                onChange={() => setSelectedRating(r)}
              />
              {r}
>>>>>>> Stashed changes
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
<<<<<<< Updated upstream
};

export default ServicesFilter;
=======
}
>>>>>>> Stashed changes
