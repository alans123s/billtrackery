
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';
import SitesList from '../components/SitesList';
import BillsHistory from '../components/BillsHistory';
import Header from '../components/Header';
import { Site } from '../types';

const Index = () => {
  const { auth } = useAuth();
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  
  const handleSelectSite = (site: Site) => {
    setSelectedSite(site);
  };
  
  const handleBack = () => {
    setSelectedSite(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="max-w-4xl mx-auto">
          {!auth.isAuthenticated ? (
            <div className="space-y-8 my-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">CEMIG Account Manager</h1>
                <p className="text-muted-foreground">
                  Acesse suas contas de energia e histórico de consumo
                </p>
              </div>
              <LoginForm />
            </div>
          ) : (
            <>
              {selectedSite ? (
                <BillsHistory site={selectedSite} onBack={handleBack} />
              ) : (
                <SitesList onSelectSite={handleSelectSite} />
              )}
            </>
          )}
        </div>
      </main>
      
      <footer className="py-6 border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CEMIG Account Manager - Não oficial</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
