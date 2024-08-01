import * as XLSX from 'xlsx';

export function saveToExcel(data) {
    const ws = XLSX.utils.json_to_sheet([data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Credit Card Info');
    XLSX.writeFile(wb, 'credit_card_info.xlsx');
}
