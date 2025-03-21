
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Index from "@/pages/Index";
import Quotes from "@/pages/Quotes";
import Shipments from "@/pages/Shipments";
import Clients from "@/pages/Clients";
import Finance from "@/pages/Finance";
import Documents from "@/pages/Documents";
import Team from "@/pages/Team";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Suppliers from "@/pages/Suppliers";

function App() {
  return (
    <BrowserRouter>
      <div className="relative">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
