import React from 'react';
import {
  BarChart,
  Users,
  FileText,
  Truck,
  Package,
  Files,
  DollarSign,
  UserPlus,
  Settings,
  FileCheck,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const sidebarClass = isOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out ${sidebarClass} md:translate-x-0`}
    >
      <div className="flex items-center justify-between p-4">
        <span className="font-bold text-lg">Dashboard</span>
        <button
          className="md:hidden text-gray-500 hover:text-white focus:outline-none"
          onClick={onClose}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <nav className="flex-1 px-2 py-4">
        <ul>
          <li>
            <NavLink to="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              <BarChart className="inline-block mr-2 h-5 w-5" />
              Tableau de bord
            </NavLink>
          </li>
          <li>
            <NavLink to="/quotes" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              <FileText className="inline-block mr-2 h-5 w-5" />
              Devis
            </NavLink>
          </li>
          <li>
            <NavLink to="/invoices" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              <FileCheck className="inline-block mr-2 h-5 w-5" />
              Factures
            </NavLink>
          </li>
          <li>
            <NavLink to="/clients" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              <Users className="inline-block mr-2 h-5 w-5" />
              Clients
            </NavLink>
          </li>
          <li>
            <NavLink to="/shipments" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              <Truck className="inline-block mr-2 h-5 w-5" />
              Expéditions
            </NavLink>
          </li>
          <li>
            <NavLink to="/suppliers" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              <Package className="inline-block mr-2 h-5 w-5" />
              Fournisseurs
            </NavLink>
          </li>
          <li>
            <NavLink to="/documents" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              <Files className="inline-block mr-2 h-5 w-5" />
              Documents
            </NavLink>
          </li>
          <li>
            <NavLink to="/finance" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              <DollarSign className="inline-block mr-2 h-5 w-5" />
              Finance
            </NavLink>
          </li>
          <li>
            <NavLink to="/team" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              <UserPlus className="inline-block mr-2 h-5 w-5" />
              Équipe
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              <Settings className="inline-block mr-2 h-5 w-5" />
              Paramètres
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
