
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  TruckIcon,
  Users,
  Ship,
  FileSpreadsheet,
  UsersRound,
  Settings,
  LayoutDashboard,
  BarChart3
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
    { to: "/quotes", label: "Devis", icon: FileText },
    { to: "/clients", label: "Clients", icon: Users },
    { to: "/suppliers", label: "Fournisseurs", icon: Ship },
    { to: "/shipments", label: "Expéditions", icon: TruckIcon },
    { to: "/finance", label: "Finance", icon: BarChart3 },
    { to: "/documents", label: "Documents", icon: FileSpreadsheet },
    { to: "/team", label: "Équipe", icon: UsersRound },
    { to: "/settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-background border-r border-border h-screen flex-shrink-0 hidden md:block">
      <div className="h-16 flex items-center px-6 border-b">
        <Link to="/" className="flex items-center gap-2">
          <Ship className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">TransitEase</span>
        </Link>
      </div>
      <nav className="px-3 py-6 space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              isActive(link.to)
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
