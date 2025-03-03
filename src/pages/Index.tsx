
/**
 * Index Page Component
 * 
 * Main landing page that displays either the login form or the application content
 * based on authentication status.
 * 
 * When authenticated, it shows either a list of sites or the bills history for a selected site.
 * Includes responsive design for various screen sizes and background styling.
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';
import SitesList from '../components/SitesList';
import BillsHistory from '../components/BillsHistory';
import Header from '../components/Header';
import { Site } from '../types';

/**
 * Main page component that serves as the application entry point
 * Handles login state and navigation between sites list and bills history
 */
const Index = () => {
  const { auth } = useAuth();
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  
  /**
   * Handle site selection to view bills history
   * @param site - The site/installation that was selected
   */
  const handleSelectSite = (site: Site) => {
    setSelectedSite(site);
  };
  
  /**
   * Navigate back to sites list from bills history
   */
  const handleBack = () => {
    setSelectedSite(null);
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-no-repeat bg-cover bg-fixed" 
      style={{ 
        backgroundImage: 'url("/lovable-uploads/93c36e4e-6dab-49d1-8b21-b66ae63c1386.png")',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Header with navigation and user info */}
      <Header />
      
      {/* Main content area */}
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="max-w-4xl mx-auto">
          {!auth.isAuthenticated ? (
            /* Login form for unauthenticated users */
            <div className="space-y-8 my-8 p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-astro-green">Astro Energy Manager</h1>
                <p className="text-muted-foreground">
                  Acesse suas contas de energia e histórico de consumo
                </p>
              </div>
              <LoginForm />
            </div>
          ) : (
            /* Content for authenticated users */
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
              {selectedSite ? (
                /* Bills history for selected site */
                <BillsHistory site={selectedSite} onBack={handleBack} />
              ) : (
                /* List of sites/installations */
                <SitesList onSelectSite={handleSelectSite} />
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer with copyright information */}
      <footer className="py-6 border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Astro Energy Manager - Não oficial</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
