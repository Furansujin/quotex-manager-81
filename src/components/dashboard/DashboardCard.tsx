
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'none';
  delay?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  className,
  children,
  animation = 'fade-up',
  delay = 0,
}) => {
  const animationClass = animation !== 'none' ? `animate-${animation}` : '';
  const delayStyle = delay ? { animationDelay: `${delay}ms` } : {};

  return (
    <Card 
      className={cn(
        "border bg-white shadow-soft overflow-hidden h-full", 
        animationClass, 
        className
      )}
      style={delayStyle}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
