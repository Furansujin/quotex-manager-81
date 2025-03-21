
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Ship, 
  Users, 
  Truck,
  DollarSign, 
  FileCheck, 
  UserCircle, 
  Settings,
  X,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const menuItems = [
    { icon: <LayoutDashboard className="mr-3 h-5 w-5" />, label: 'Tableau de Bord', path: '/' },
    { icon: <FileText className="mr-3 h-5 w-5" />, label: 'Devis', path: '/quotes' },
    { icon: <Ship className="mr-3 h-5 w-5" />, label: 'Expéditions', path: '/shipments' },
    { icon: <Users className="mr-3 h-5 w-5" />, label: 'Clients', path: '/clients' },
    { icon: <Truck className="mr-3 h-5 w-5" />, label: 'Fournisseurs', path: '/suppliers' },
    { icon: <DollarSign className="mr-3 h-5 w-5" />, label: 'Finance', path: '/finance' },
    { icon: <FileCheck className="mr-3 h-5 w-5" />, label: 'Documents', path: '/documents' },
    { icon: <UserCircle className="mr-3 h-5 w-5" />, label: 'Équipe', path: '/team' },
    { icon: <Settings className="mr-3 h-5 w-5" />, label: 'Paramètres', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r p-4 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">QuoteX</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path}
                className="flex items-center py-2 px-3 text-base rounded-md hover:bg-muted transition-colors"
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="fixed bottom-4 w-56">
            <Button variant="outline" className="w-full justify-start">
              <LogOut className="mr-3 h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-64 pt-16 bg-background border-r shadow-sm">
        <div className="px-3 py-4">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path}
                className="flex items-center py-2 px-3 text-base rounded-md hover:bg-muted transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
