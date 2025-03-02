
import * as XLSX from 'xlsx';
import { Bill, Site } from '@/types';
import { format, parseISO } from 'date-fns';
import { getStatusLabel } from '@/components/bills/BillCard';

export const exportBillsToExcel = (bills: Bill[], site: Site) => {
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
  
  return true;
};
