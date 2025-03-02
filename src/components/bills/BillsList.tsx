
import React from 'react';
import { Bill } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ClipLoader } from 'react-spinners';
import { AlertCircle, ReceiptIcon } from 'lucide-react';
import BillCard from './BillCard';
import { motion } from 'framer-motion';

interface BillsListProps {
  bills: Bill[];
  isLoading: boolean;
  error: string | null;
}

const BillsList: React.FC<BillsListProps> = ({ bills, isLoading, error }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bills.map((bill, index) => (
        <motion.div
          key={bill.billIdentifier}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <BillCard bill={bill} />
        </motion.div>
      ))}
    </div>
  );
};

export default BillsList;
