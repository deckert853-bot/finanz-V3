
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Profile, CalcResult } from '../types';

const fmtUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const exportToJson = (profile: Profile) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `Finanz_Export_${profile.name}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const exportToCsv = (profile: Profile) => {
  const headers = ["Datum", "Beschreibung", "Typ", "Betrag"];
  const rows = profile.entries.map(e => [e.date, e.desc, e.type, e.amount.toString()]);
  
  let csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n"
    + rows.map(r => r.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Finanz_Export_${profile.name}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportToPdf = (profile: Profile, results: CalcResult, userDisplay: string) => {
  const doc = new jsPDF();

  // Header Background
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("FINANZ-BERICHT", 15, 26);
  
  doc.setFontSize(10);
  doc.text(profile.name.toUpperCase(), 15, 33);
  doc.text(new Date().toLocaleDateString(), 180, 26, { align: "right" });

  // Meta Info
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.text(`Verantwortlich: ${profile.responsible || 'N/A'}`, 15, 55);
  doc.text(`Steuernummer: ${profile.taxId || 'N/A'}`, 15, 60);
  doc.text(`Berichtsmonat: ${profile.monthFilter || 'Gesamt'}`, 15, 65);
  doc.text(`Erstellt von: ${userDisplay}`, 15, 70);

  // Summary Box
  doc.setDrawColor(220, 220, 220);
  doc.line(140, 50, 140, 75);
  
  doc.setFontSize(9);
  doc.text(`Einnahmen:`, 145, 55); doc.text(fmtUSD(results.inc), 195, 55, { align: "right" });
  doc.text(`Ausgaben:`, 145, 60); doc.text(fmtUSD(results.exp), 195, 60, { align: "right" });
  doc.text(`Steuern (${profile.taxRate}%):`, 145, 65); doc.text(fmtUSD(results.tax), 195, 65, { align: "right" });
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Netto-Gewinn:`, 145, 73); doc.text(fmtUSD(results.net), 195, 73, { align: "right" });

  // Table
  const tableData = results.filteredEntries.map(e => [
    e.date,
    e.desc,
    e.type,
    (e.type === 'Einnahme' ? '+' : '-') + fmtUSD(e.amount)
  ]);

  // Use the autoTable function directly instead of doc.autoTable
  autoTable(doc, {
    startY: 85,
    head: [['Datum', 'Beschreibung', 'Typ', 'Betrag']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], fontSize: 10 },
    columnStyles: { 3: { halign: 'right' } },
    styles: { fontSize: 9 }
  });

  doc.save(`Finanzbericht_${profile.name.replace(/\s+/g, '_')}_${profile.monthFilter || 'Gesamt'}.pdf`);
};
