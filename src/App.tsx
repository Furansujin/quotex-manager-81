
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Index from './pages/Index';
import Quotes from './pages/Quotes';
import Clients from './pages/Clients';
import Shipments from './pages/Shipments';
import Suppliers from './pages/Suppliers';
import Documents from './pages/Documents';
import Finance from './pages/Finance';
import Team from './pages/Team';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Invoices from './pages/Invoices'; // Nouvelle importation

import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/shipments" element={<Shipments />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/team" element={<Team />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invoices" element={<Invoices />} /> {/* Nouvelle route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
