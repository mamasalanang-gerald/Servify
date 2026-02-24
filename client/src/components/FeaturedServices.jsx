import { useNavigate } from 'react-router-dom';

const services = [
  {
    id: 1,
    category: 'Home Cleaning',
    title: 'Deep House Cleaning',
    provider: 'Sarah Johnson',
    jobs: '342 jobs completed',
    rating: 4.9,
    price: 89,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    avatar: 'https://i.pravatar.cc/40?img=47',
  },
  {
    id: 2,
    category: 'Plumbing',
    title: 'Emergency Plumbing Repair',
    provider: 'David Martinez',
    jobs: '528 jobs completed',
    rating: 4.8,
    price: 75,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    avatar: 'https://i.pravatar.cc/40?img=12',
  },
  {
    id: 3,
    category: 'Beauty & Spa',
    title: 'Luxury Spa & Massage',
    provider: 'Sophia Lee',
    jobs: '187 jobs completed',
    rating: 5,
    price: 120,
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
    avatar: 'https://i.pravatar.cc/40?img=45',
  },
];

export default function FeaturedServices() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 bg-white dark:bg-[#0f1623] transition-colors">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-[2rem] font-bold text-app-text dark:text-[#f1f5f9] mb-1 transition-colors">
              Featured Services
            </h2>
            <p className="font-sans text-app-text-muted dark:text-[#94a3b8] text-[0.95rem] transition-colors">
              Top-rated professionals ready to help
            </p>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-1.5 text-[#2c3fd1] dark:text-[#7b93ff] font-sans font-semibold text-[0.9rem] hover:gap-2.5 transition-all"
          >
            View All
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6 md:grid-cols-2 sm:grid-cols-1">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="rounded-2xl border border-[#e2e6f3] dark:border-[#2a3045] bg-white dark:bg-[#1a1f2e] overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[0_8px_32px_rgba(44,63,209,0.12)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1 group"
              onClick={() => navigate(`/services/${svc.id}`)}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.target.style.background = '#eef1fb'; }}
                />
                {/* Rating badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white dark:bg-[#1a1f2e] rounded-full px-2.5 py-1 shadow-md">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="font-sans font-bold text-[0.8rem] text-app-text dark:text-[#f1f5f9]">{svc.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category pill */}
                <span className="inline-block text-[0.75rem] font-semibold text-[#2c3fd1] dark:text-[#7b93ff] bg-[#eef1fb] dark:bg-[#1e2a4a] px-2.5 py-0.5 rounded-full mb-3">
                  {svc.category}
                </span>

                <h3 className="font-heading font-bold text-[1.05rem] text-app-text dark:text-[#f1f5f9] mb-3 transition-colors">
                  {svc.title}
                </h3>

                {/* Provider */}
                <div className="flex items-center gap-2 mb-4">
                  <img src={svc.avatar} alt={svc.provider} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-sans font-semibold text-[0.85rem] text-app-text dark:text-[#f1f5f9] transition-colors">
                        {svc.provider}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#2c3fd1" className="dark:fill-[#7b93ff]">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <span className="font-sans text-[0.75rem] text-[#94a3b8]">{svc.jobs}</span>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-[#f0f2f8] dark:border-[#2a3045]">
                  <div>
                    <span className="font-sans text-[0.75rem] text-[#94a3b8]">Starting at</span>
                    <div className="font-heading font-bold text-[1.2rem] text-app-text dark:text-[#f1f5f9] transition-colors">
                      ${svc.price}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/services/${svc.id}`); }}
                    className="bg-[#2c3fd1] hover:bg-[#1e2fa8] text-white font-sans font-semibold text-[0.85rem] px-4 py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}