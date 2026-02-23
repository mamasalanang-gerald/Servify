import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const BookingCard = ({ booking }) => {
  return (
    <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <img src={booking.img} alt={booking.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold text-foreground">{booking.title}</h4>
        <p className="text-sm text-muted-foreground">{booking.subtitle}</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {booking.date}
          </span>
          <Badge 
            variant={booking.status === 'upcoming' ? 'default' : 'secondary'}
            className={cn(
              "capitalize",
              booking.status === 'upcoming' && "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
              booking.status === 'completed' && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400"
            )}
          >
            {booking.status}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="text-xl font-bold text-foreground">{booking.total}</div>
        </div>
        <Button variant="outline" size="sm">View Details</Button>
      </div>
    </Card>
  );
};

export default BookingCard;