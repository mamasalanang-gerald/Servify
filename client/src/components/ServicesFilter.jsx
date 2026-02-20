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
  };

  return (
    <aside className="services-filter">
      <div className="services-filter__header">
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
            </label>
          ))}
        </div>
      </div>

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
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
