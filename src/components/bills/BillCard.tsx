
import React from 'react';
import { Bill } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BillCardProps {
  bill: Bill;
}

export const getStatusLabel = (status: string) => {
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

export const getStatusColor = (status: string) => {
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

const BillCard: React.FC<BillCardProps> = ({ bill }) => {
  return (
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
  );
};

export default BillCard;
