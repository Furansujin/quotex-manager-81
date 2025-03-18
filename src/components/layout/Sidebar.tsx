
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  FileText, 
  Ship, 
  FileStack, 
  UsersRound, 
  DollarSign, 
  Settings, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleCollapse = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Quotes', path: '/quotes' },
    { icon: Ship, label: 'Shipments', path: '/shipments' },
    { icon: FileStack, label: 'Documents', path: '/documents' },
    { icon: UsersRound, label: 'Team', path: '/team' },
    { icon: DollarSign, label: 'Finance', path: '/finance' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside 
      className={cn(
        "fixed h-screen bg-sidebar z-40 border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isOpen ? "left-0" : "-left-full md:left-0",
        collapsed ? "w-16" : "w-64",
        "animate-fade-in",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <span className="font-medium text-lg tracking-tight">QuoteX Manager</span>
          )}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="md:hidden ml-auto"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCollapse}
              className="hidden md:flex ml-auto"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          )}
        </div>
        
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all group",
                  isActive(item.path)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed && "h-6 w-6")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
          
          <Separator className="my-4 bg-sidebar-border" />
          
          <div className="px-4">
            {!collapsed && (
              <div className="rounded-md bg-sidebar-accent p-3">
                <h4 className="font-medium text-sm mb-1">Need Help?</h4>
                <p className="text-xs mb-2 text-sidebar-foreground/80">
                  Contact our support team for assistance.
                </p>
                <Button size="sm" className="w-full text-xs" variant="outline">
                  Contact Support
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4">
          <div className={cn(
            "flex items-center gap-3 rounded-md bg-sidebar-accent/50 p-3",
            collapsed && "justify-center p-2"
          )}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              JD
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">John Doe</p>
                <p className="text-xs text-sidebar-foreground/80 truncate">john@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
