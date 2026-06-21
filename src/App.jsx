import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeroEditor from './pages/HeroEditor';
import ServicesManager from './pages/ServicesManager';
import StatsEditor from './pages/StatsEditor';
import AboutEditor from './pages/AboutEditor';
import ProcessManager from './pages/ProcessManager';
import PortfolioManager from './pages/PortfolioManager';
import PricingManager from './pages/PricingManager';
import ContactsViewer from './pages/ContactsViewer';
import ProposalsViewer from './pages/ProposalsViewer';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#030610] text-white overflow-hidden font-inter">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-blue-500/[0.03] blur-[150px] rounded-full pointer-events-none"></div>

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative z-10 transition-all duration-300">
        <TopBar setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="stats" element={<StatsEditor />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="process" element={<ProcessManager />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="pricing" element={<PricingManager />} />
          <Route path="contacts" element={<ContactsViewer />} />
          <Route path="proposals" element={<ProposalsViewer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
