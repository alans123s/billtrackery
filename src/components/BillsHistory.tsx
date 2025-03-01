
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getBillsHistory } from '../services/api';
import { Bill, Site } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ClipLoader } from 'react-spinners';
import { useToast } from '@/hooks/use-toast';
import { Download, ArrowLeft, AlertCircle, ReceiptIcon } from 'lucide-react';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';

interface BillsHistoryProps {
  site: Site;
  onBack: () => void;
}

const BillsHistory: React.FC<BillsHistoryProps> = ({ site, onBack }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { auth } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBills = async () => {
      if (!auth.accessToken || !auth.protocol || !auth.protocolId || !auth.pId) {
        setError('Não autorizado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      try {
        const billsData = await getBillsHistory(
          auth.accessToken,
          auth.protocol,
          auth.protocolId,
          auth.pId,
          site.id
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
  }, [site, auth, toast]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'Paga';
      case 'AutomaticDebit':
        return 'Débito Automático';
      case 'Pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'AutomaticDebit':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      bills.map(bill => ({
        'Mês de Referência': bill.referenceMonth,
        'Data de Vencimento': format(parseISO(bill.dueDate), 'dd/MM/yyyy'),
        'Valor (R$)': bill.value.toFixed(2).replace('.', ','),
        'Consumo (kWh)': bill.consumption,
        'Status': getStatusLabel(bill.status),
        'Identificador da Conta': bill.billIdentifier,
        'Contrato': bill.site.contract
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Histórico de Contas');
    
    // Set column widths
    const colWidths = [
      { wch: 15 }, // Mês de Referência
      { wch: 20 }, // Data de Vencimento
      { wch: 15 }, // Valor
      { wch: 15 }, // Consumo
      { wch: 20 }, // Status
      { wch: 40 }, // Identificador
      { wch: 20 }, // Contrato
    ];
    
    worksheet['!cols'] = colWidths;
    
    XLSX.writeFile(workbook, `historico_contas_${site.siteNumber}.xlsx`);
    
    toast({
      title: "Download concluído",
      description: "O arquivo foi baixado com sucesso",
    });
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
        <Button variant="outline" onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <Button onClick={downloadExcel} disabled={bills.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Excel
        </Button>
      </div>
      
      <div className="text-center mt-2 mb-6">
        <h2 className="text-2xl font-bold">Histórico de Contas</h2>
        <p className="text-muted-foreground">
          Instalação {site.siteNumber} - {site.address}
        </p>
      </div>
      
      {bills.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <ReceiptIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
            <p>Nenhuma conta encontrada para esta instalação.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bills.map((bill) => (
            <Card key={bill.billIdentifier} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Referência: {bill.referenceMonth}
                    </CardTitle>
                    <CardDescription>
                      Vencimento: {format(parseISO(bill.dueDate), 'dd/MM/yyyy')}
                      {new Date() < parseISO(bill.dueDate) && (
                        <span className="ml-2 text-xs opacity-70">
                          (em {formatDistanceToNow(parseISO(bill.dueDate), { locale: ptBR })})
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                      {getStatusLabel(bill.status)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor:</p>
                    <p className="font-semibold">R$ {bill.value.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Consumo:</p>
                    <p className="font-semibold">{bill.consumption} kWh</p>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <p className="text-xs text-muted-foreground">
                  Contrato: {bill.site.contract}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillsHistory;
