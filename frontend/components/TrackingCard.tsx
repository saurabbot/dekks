import { Package, ChevronRight } from 'lucide-react';

interface TrackingCardProps {
  id: string;
  status: string;
  onClick?: () => void;
}

export const TrackingCard = ({ id, status, onClick }: TrackingCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="p-5 bg-background rounded-xl hover:border-propulsion-orange/30 hover:shadow-2xl hover:shadow-orange-500/5 transition-all group cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-muted rounded-lg group-hover:border-propulsion-orange/20 transition-colors text-muted-foreground group-hover:text-propulsion-orange">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-propulsion-orange transition-colors uppercase tracking-tight">{id}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
                status === 'Pending' ? 'bg-blue-500' : 
                status === 'Delivered' ? 'bg-green-500' : 'bg-propulsion-orange'
              }`} />
              {status}
            </div>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground/30 group-hover:text-propulsion-orange transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
