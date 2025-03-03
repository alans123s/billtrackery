
/**
 * BillsHistory Component
 * 
 * Displays the history of energy bills for a selected site/installation.
 * Provides functionality to switch between card and table views.
 * Includes site selection and Excel export features.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getBillsHistory, getSitesList } from '../services/api';
import { Bill, Site } from '../types';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Grid, Table as TableIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClipLoader } from 'react-spinners';
import { exportBillsToExcel } from '@/utils/excelExporter';
import SiteSelector from './bills/SiteSelector';
import BillsList from './bills/BillsList';
import BillsTable from './bills/BillsTable';
import { motion } from 'framer-motion';

interface BillsHistoryProps {
  site: Site;
  onBack: () => void;
}

/**
 * Component for displaying and interacting with bills history
 * Provides view switching between cards and table formats
 */
const BillsHistory: React.FC<BillsHistoryProps> = ({ site, onBack }) => {
  // State for bills data and loading states
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for sites data and selection
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(site.id);
  
  // Toggle between card and table views
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Access authentication and toast functionality
  const { auth } = useAuth();
  const { toast } = useToast();

  // Fetch bills when selected site changes
  useEffect(() => {
    const fetchBills = async () => {
      if (!auth.accessToken || !auth.protocol || !auth.protocolId || !auth.pId) {
        setError('Não autorizado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const billsData = await getBillsHistory(
          auth.accessToken,
          auth.protocol,
          auth.protocolId,
          auth.pId,
          selectedSiteId
        );
        setBills(billsData);
      } catch (error) {
        console.error('Error fetching bills:', error);
        setError('Erro ao buscar histórico de contas. Tente novamente mais tarde.');
        toast({
          title: "Erro",
          description: "Não foi possível carregar o histórico de contas",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
  }, [selectedSiteId, auth, toast]);

  // Fetch available sites on component mount
  useEffect(() => {
    const fetchSites = async () => {
      if (!auth.accessToken || !auth.protocol || !auth.protocolId || !auth.pId) {
        return;
      }

      setLoadingSites(true);
      try {
        const sitesData = await getSitesList(
          auth.accessToken,
          auth.protocol,
          auth.protocolId,
          auth.pId
        );
        // Filter only active sites
        const activeSites = sitesData.filter(site => site.status === 'Active');
        setSites(activeSites);
      } catch (error) {
        console.error('Error fetching sites:', error);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [auth]);

  // Handle site selection change
  const handleSiteChange = (siteId: string) => {
    setSelectedSiteId(siteId);
  };

  // Export bills data to Excel file
  const downloadExcel = () => {
    const currentSite = sites.find(s => s.id === selectedSiteId) || site;
    const success = exportBillsToExcel(bills, currentSite);
    
    if (success) {
      toast({
        title: "Download concluído",
        description: "O arquivo foi baixado com sucesso",
      });
    }
  };

  // Get current site details
  const currentSite = sites.find(s => s.id === selectedSiteId) || site;

  // Show loading state when both bills and sites are loading initially
  if (isLoading && sites.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <ClipLoader size={40} color="#000000" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Top navigation and view controls */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <Button variant="outline" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lista
          </Button>
          
          <div className="flex gap-2">
            {/* View mode toggle buttons */}
            <div className="bg-muted rounded-md p-1 flex">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="rounded-sm"
              >
                <Grid className="h-4 w-4 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-sm"
              >
                <TableIcon className="h-4 w-4 mr-1" />
                Tabela
              </Button>
            </div>
            
            {/* Excel export button - only shown in table view */}
            {viewMode === 'table' && (
              <Button 
                onClick={downloadExcel} 
                disabled={bills.length === 0 || isLoading} 
                className="shrink-0"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            )}
          </div>
        </div>
        
        {/* Site selector dropdown */}
        <SiteSelector 
          sites={sites} 
          selectedSiteId={selectedSiteId} 
          onSiteChange={handleSiteChange}
          isLoading={isLoading}
          loadingSites={loadingSites}
        />
      </div>
      
      {/* Page title and subtitle */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Histórico de Contas</h2>
        <p className="text-muted-foreground">
          Instalação {currentSite.siteNumber} - {currentSite.address}
        </p>
      </div>
      
      {/* Animated view switching between cards and table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        key={viewMode}
      >
        {viewMode === 'cards' ? (
          <BillsList bills={bills} isLoading={isLoading} error={error} />
        ) : (
          <BillsTable bills={bills} isLoading={isLoading} error={error} />
        )}
      </motion.div>
    </div>
  );
};

export default BillsHistory;
