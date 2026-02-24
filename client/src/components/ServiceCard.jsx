import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ServiceCard = ({ service }) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/40 animate-in fade-in slide-in-from-bottom-5">
      <div className="relative h-[200px] overflow-hidden">
        <img 
          src={service.img} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-400 hover:scale-105" 
        />
        <div className="absolute top-3 right-3 bg-white dark:bg-slate-100 rounded-full px-2.5 py-1 text-xs font-bold text-slate-900 flex items-center gap-1 shadow-md">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {service.rating}
        </div>
        <Badge className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900">
          {service.category}
        </Badge>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">{service.title}</h3>

        <div className="flex items-center gap-2.5">
          {service.providerImage ? (
            <img src={service.providerImage} alt={service.providerName} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {service.providerInitial}
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
              {service.providerName}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#2b52cc" opacity="0.15" />
                <polyline points="9 12 11 14 15 10" stroke="#2b52cc" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{service.jobs} jobs completed</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 mt-1">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Starting at</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{service.price}</div>
          </div>
          <Button className="bg-gradient-to-br from-blue-900 to-blue-600 text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
