
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
  animation?: 'fade-up' | 'fade-in' | 'none';
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconClassName,
  animation = 'fade-up',
  delay = 0,
}) => {
  const animationClass = animation !== 'none' ? `animate-${animation}` : '';
  const delayStyle = delay ? { animationDelay: `${delay}ms` } : {};

  return (
    <Card
      className={cn(
        "overflow-hidden border bg-white shadow-soft h-full",
        animationClass,
        className
      )}
      style={delayStyle}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
            
            {trend && (
              <div className="flex items-center mt-1">
                <span
                  className={cn(
                    "text-xs font-medium flex items-center",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs last month</span>
              </div>
            )}
          </div>
          
          <div
            className={cn(
              "rounded-full p-3 bg-primary/10 text-primary",
              iconClassName
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
