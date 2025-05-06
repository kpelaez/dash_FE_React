import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({children}: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 w-full">
          <div className="container mx-auto h-full">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout