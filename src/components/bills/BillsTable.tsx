
import React from 'react';
import { Bill } from '@/types';
import { format, parseISO } from 'date-fns';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipLoader } from 'react-spinners';
import { AlertCircle, ReceiptIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getStatusLabel, getStatusColor } from './BillCard';

interface BillsTableProps {
  bills: Bill[];
  isLoading: boolean;
  error: string | null;
}

const BillsTable: React.FC<BillsTableProps> = ({ bills, isLoading, error }) => {
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

  if (bills.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <ReceiptIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
          <p>Nenhuma conta encontrada para esta instalação.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Histórico de contas de energia</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Referência</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor (R$)</TableHead>
            <TableHead>Consumo (kWh)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Contrato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.billIdentifier}>
              <TableCell className="font-medium">{bill.referenceMonth}</TableCell>
              <TableCell>{format(parseISO(bill.dueDate), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{bill.value.toFixed(2).replace('.', ',')}</TableCell>
              <TableCell>{bill.consumption}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                  {getStatusLabel(bill.status)}
                </span>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{bill.site.contract}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BillsTable;
