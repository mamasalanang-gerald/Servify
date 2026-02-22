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

const ratings = ['4.5+ Stars', '4+ Stars', '3.5+ Stars', '3& below'];

const ServicesFilter = ({ filters, onFilterChange }) => {
  const { priceRange, selectedRating, selectedCategories } = filters;

  const update = (patch) => onFilterChange({ ...filters, ...patch });

  const toggleCategory = (cat) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    update({ selectedCategories: updated });
  };

  const clearAll = () => {
    onFilterChange({ priceRange: 25000, selectedRating: '', selectedCategories: [] });
  };

  return (
    <aside className="services-filter">
      <div className="services-filter__header">
        <h3 className="services-filter__title">Filters</h3>
        <button className="services-filter__clear" onClick={clearAll}>Clear All</button>
      </div>

      {/* Price Range */}
      <div className="services-filter__section">
        <h4 className="services-filter__label">Max Price</h4>
        <input
          type="range"
          min="500"
          max="25000"
          step="500"
          value={priceRange}
          onChange={(e) => update({ priceRange: Number(e.target.value) })}
          className="services-filter__slider"
        />
        <div className="services-filter__price-labels">
          <span>₱500</span>
          <span>₱{priceRange.toLocaleString()}</span>
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
                onChange={() => update({ selectedRating: rating })}
                className="services-filter__radio"
              />
              <span>{rating}</span>
            </label>
          ))}
        </div>
      </div>

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
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ServicesFilter;