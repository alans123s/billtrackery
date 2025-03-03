
/**
 * Excel Export Utility
 * 
 * Provides functionality to export bill data to Excel format.
 * Converts data to the correct format and handles file creation.
 */

import * as XLSX from 'xlsx';
import { Bill, Site } from '@/types';
import { format, parseISO } from 'date-fns';
import { getStatusLabel } from '@/components/bills/BillCard';

/**
 * Exports bills data to an Excel file
 * @param bills - Array of Bill objects to export
 * @param site - Site information to include in the filename
 * @returns Boolean indicating success/failure
 */
export const exportBillsToExcel = (bills: Bill[], site: Site) => {
  // Transform bills data into a more export-friendly format
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
  
  // Create a new workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Histórico de Contas');
  
  // Set column widths for better readability
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
  
  // Write file and trigger download
  XLSX.writeFile(workbook, `historico_contas_${site.siteNumber}.xlsx`);
  
  return true;
};
