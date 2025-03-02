
import React, { useState } from 'react';
import { Bill } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [expanded, setExpanded] = useState(false);

  return (
    <Card 
      key={bill.billIdentifier} 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={() => setExpanded(!expanded)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {bill.referenceMonth}
          </CardTitle>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
            {getStatusLabel(bill.status)}
          </span>
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
          <div className="col-span-2 flex justify-center items-center mt-2">
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Separator className="my-3" />
              
              <div className="space-y-2 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Vencimento:</p>
                  <p className="font-medium">{format(parseISO(bill.dueDate), 'dd/MM/yyyy')}
                    {new Date() < parseISO(bill.dueDate) && (
                      <span className="ml-2 text-xs opacity-70">
                        (em {formatDistanceToNow(parseISO(bill.dueDate), { locale: ptBR })})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contrato:</p>
                  <p className="font-medium">{bill.site.contract}</p>
                </div>
                {/* We only display site number info if it's available in the bill.site object */}
                {bill.site && bill.site.siteNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Instalação:</p>
                    <p className="font-medium">{bill.site.siteNumber}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default BillCard;
