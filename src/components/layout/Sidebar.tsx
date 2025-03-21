
import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FileText, 
  Users, 
  Truck, 
  Briefcase, 
  File, 
  BarChart3, 
  Settings, 
  UserPlus,
  FileInvoice  // Nouvel import d'icône
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cette fonction gère le clic à l'extérieur du sidebar pour le fermer (sur mobile)
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        backdropRef.current && 
        backdropRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop - visible uniquement sur mobile lorsque le sidebar est ouvert */}
      <div 
        ref={backdropRef}
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 pt-16 z-30 transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-6 py-4">
          <p className="text-xs font-medium text-gray-400 uppercase mb-4">Menu principal</p>
          <nav className="space-y-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
              end
            >
              <Home className="mr-3 h-4 w-4" />
              Tableau de bord
            </NavLink>

            <NavLink 
              to="/quotes" 
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <FileText className="mr-3 h-4 w-4" />
              Devis
            </NavLink>

            <NavLink 
              to="/invoices" 
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <FileInvoice className="mr-3 h-4 w-4" />
              Factures
            </NavLink>

            <NavLink 
              to="/shipments" 
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Truck className="mr-3 h-4 w-4" />
              Expéditions
            </NavLink>

            <NavLink 
              to="/clients" 
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Users className="mr-3 h-4 w-4" />
              Clients
            </NavLink>

            <NavLink 
              to="/suppliers" 
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Briefcase className="mr-3 h-4 w-4" />
              Fournisseurs
            </NavLink>

            <NavLink 
              to="/documents" 
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <File className="mr-3 h-4 w-4" />
              Documents
            </NavLink>

            <NavLink 
              to="/finance" 
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <BarChart3 className="mr-3 h-4 w-4" />
              Finance
            </NavLink>

            <NavLink 
              to="/team" 
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <UserPlus className="mr-3 h-4 w-4" />
              Équipe
            </NavLink>

            <NavLink 
              to="/settings" 
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Settings className="mr-3 h-4 w-4" />
              Paramètres
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
