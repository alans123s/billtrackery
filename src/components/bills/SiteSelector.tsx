
import React from 'react';
import { Site } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SiteSelectorProps {
  sites: Site[];
  selectedSiteId: string;
  onSiteChange: (siteId: string) => void;
  isLoading: boolean;
  loadingSites: boolean;
}

const SiteSelector: React.FC<SiteSelectorProps> = ({
  sites,
  selectedSiteId,
  onSiteChange,
  isLoading,
  loadingSites,
}) => {
  const currentSiteIndex = sites.findIndex(s => s.id === selectedSiteId);
  const prevSite = currentSiteIndex > 0 ? sites[currentSiteIndex - 1] : null;
  const nextSite = currentSiteIndex < sites.length - 1 ? sites[currentSiteIndex + 1] : null;
  
  return (
    <div className="bg-muted/50 p-2 rounded-lg">
      <div className="flex items-center gap-2 justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => prevSite && onSiteChange(prevSite.id)}
          disabled={!prevSite || isLoading}
          className="h-8 w-8 p-0 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Instalação anterior</span>
        </Button>
        
        <div className="flex-1">
          <Select 
            value={selectedSiteId} 
            onValueChange={onSiteChange}
            disabled={loadingSites || sites.length === 0 || isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma instalação" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  Instalação {s.siteNumber} - {s.address.substring(0, 30)}
                  {s.address.length > 30 ? '...' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => nextSite && onSiteChange(nextSite.id)}
          disabled={!nextSite || isLoading}
          className="h-8 w-8 p-0 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Próxima instalação</span>
        </Button>
      </div>
    </div>
  );
};

export default SiteSelector;
