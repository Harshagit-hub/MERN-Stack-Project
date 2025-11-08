import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';

const MainLayout = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Left Sidebar */}
      <LeftSidebar
        open={leftSidebarOpen}
        toggleSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
      />

      {/* Main content */}
      <main className="flex-1 transition-all duration-300">
        {/* Pass state to child pages */}
        <Outlet context={{ leftSidebarOpen }} />
      </main>
    </div>
  );
};

export default MainLayout;

