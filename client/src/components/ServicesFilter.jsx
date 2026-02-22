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

import { Card } from './ui/card';
import { Button } from './ui/button';

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
    <Card className="p-6 sticky top-[90px] animate-in fade-in slide-in-from-bottom-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-slate-900">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearAll}
          className="text-blue-600 hover:text-blue-900 hover:underline h-auto p-0 text-xs font-semibold"
        >
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <h4 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight">Max Price</h4>
        <input
          type="range"
          min="500"
          max="25000"
          step="500"
          value={priceRange}
          onChange={(e) => update({ priceRange: Number(e.target.value) })}
          className="w-full accent-blue-600 cursor-pointer mb-2"
        />
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>₱500</span>
          <span>₱{priceRange.toLocaleString()}</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <h4 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight">Minimum Rating</h4>
        <div className="flex flex-col gap-2.5">
          {ratings.map((rating) => (
            <label key={rating} className="flex items-center gap-2.5 text-sm text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => update({ selectedRating: rating })}
                className="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
              />
              <span>{rating}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight">Categories</h4>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <label key={cat.name} className="flex items-center gap-2.5 text-sm text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
                className="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
              />
              <span>{cat.name} <span className="text-slate-500 text-xs">({cat.count})</span></span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ServicesFilter;