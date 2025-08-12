import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CollapsibleSidebar from './CollapsedSidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({children}: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      {/* Sidebar */}
      <CollapsibleSidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 w-full">
          <div className="container mx-auto w-full h-full">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout