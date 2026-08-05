import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex">
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      <main
        className="flex-1 bg-background min-h-screen"
        style={{ width: 'calc(100% - 260px)' }}
      >
        <Header onMenuClick={handleMenuClick} />
        <div className="h-14" /> {/* Spacer for fixed header */}
        <div className="p-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
