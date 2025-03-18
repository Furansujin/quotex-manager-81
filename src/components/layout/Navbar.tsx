
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  toggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const isMobile = useIsMobile();
  
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-background z-50 border-b flex items-center justify-between px-4 md:px-6 animate-fade-in shadow-soft">
      <div className="flex items-center gap-2 md:gap-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <div className="absolute w-3 h-3 bg-white rounded-full top-1 left-1" />
            <div className="absolute w-4 h-2 bg-white rounded-full bottom-1 right-1" />
          </div>
          <span className="font-semibold text-lg tracking-tight hidden md:block">QuoteX</span>
        </Link>
      </div>
      
      <div className={cn("flex-1 max-w-md mx-4 hidden md:block")}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes, shipments..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
