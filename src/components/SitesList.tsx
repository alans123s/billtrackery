
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSitesList } from '../services/api';
import { Site } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ClipLoader } from 'react-spinners';
import { HomeIcon, AlertCircle } from 'lucide-react';

interface SitesListProps {
  onSelectSite: (site: Site) => void;
}

const SitesList: React.FC<SitesListProps> = ({ onSelectSite }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { auth } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSites = async () => {
      if (!auth.accessToken || !auth.protocol || !auth.protocolId || !auth.pId) {
        setError('Não autorizado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      try {
        const sitesData = await getSitesList(
          auth.accessToken,
          auth.protocol,
          auth.protocolId,
          auth.pId
        );
        setSites(sitesData);
      } catch (error) {
        console.error('Error fetching sites:', error);
        setError('Erro ao buscar instalações. Tente novamente mais tarde.');
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas instalações",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, [auth, toast]);

  const handleSelectSite = (site: Site) => {
    onSelectSite(site);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <ClipLoader size={40} color="#000000" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-4" />
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mt-2 mb-6">
        <h2 className="text-2xl font-bold">Suas Instalações</h2>
        <p className="text-muted-foreground">Selecione uma instalação para ver o histórico de contas</p>
      </div>
      
      {sites.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Nenhuma instalação encontrada para sua conta.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sites.map((site) => (
            <Card key={site.id + site.contract} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant={site.status === 'Active' ? 'default' : 'secondary'}>
                    {site.status === 'Active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                  {site.owner && (
                    <Badge variant="outline" className="bg-amber-50">
                      Proprietário
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-2">
                    <HomeIcon size={18} />
                    Instalação {site.siteNumber}
                  </div>
                </CardTitle>
                <CardDescription className="text-xs truncate mt-1">
                  Contrato: {site.contract}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                <p className="text-sm text-muted-foreground truncate">{site.address}</p>
                <Button 
                  onClick={() => handleSelectSite(site)} 
                  className="w-full"
                  disabled={site.status !== 'Active'}
                >
                  Ver Contas
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SitesList;
