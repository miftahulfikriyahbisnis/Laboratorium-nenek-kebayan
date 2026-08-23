import jsPDF from 'jspdf';
import { StudentProgress } from '../types';
import { MISSIONS } from '../data/missionsData';

/**
 * Downloads the official completion certificate as a PDF file.
 */
export function generateCertificatePDF(progress: StudentProgress): { success: boolean; filename: string } {
  const studentName = progress.studentName.trim() || 'Murid Laboratorium';
  const cleanName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Sertifikat_Tabib_Kimia_${cleanName}.pdf`;

  // A4 Landscape certificate: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Background color (Warm Antique Parchment / Cream #FAF7F0)
  doc.setFillColor(250, 247, 240);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Ornate Border (Herbal Green #5C7A5C)
  doc.setDrawColor(92, 122, 92);
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner Gold Border (Candle Gold #D9A441)
  doc.setDrawColor(217, 164, 65);
  doc.setLineWidth(1);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Corner Ornaments
  const cornerSize = 10;
  const corners = [
    [14, 14],
    [pageWidth - 14 - cornerSize, 14],
    [14, pageHeight - 14 - cornerSize],
    [pageWidth - 14 - cornerSize, pageHeight - 14 - cornerSize],
  ];
  doc.setFillColor(217, 164, 65);
  corners.forEach(([x, y]) => {
    doc.rect(x, y, cornerSize, cornerSize, 'F');
  });

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(122, 82, 48); // Wood Brown #7A5230
  doc.setFontSize(14);
  doc.text('LABORATORIUM TRADISIONAL MELAYU & KIMIA ANALITIK', pageWidth / 2, 28, { align: 'center' });

  doc.setFontSize(26);
  doc.setTextColor(92, 122, 92); // Herbal Green #5C7A5C
  doc.text('SERTIFIKAT KELULUSAN TABIB KIMIA', pageWidth / 2, 40, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('Dengan ini menerangkan bahwa sang penuntut ilmu:', pageWidth / 2, 49, { align: 'center' });

  // Student Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(122, 82, 48); // Wood Brown
  doc.text(studentName.toUpperCase(), pageWidth / 2, 62, { align: 'center' });

  // Underline beneath student name
  doc.setDrawColor(217, 164, 65);
  doc.setLineWidth(1.5);
  doc.line(75, 66, pageWidth - 75, 66);

  // Achievement Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(
    'Telah berhasil menyelesaikan seluruh rangkaian 4 Misi Penawar Wabah Kimia (Konsentrasi & Titrasi)',
    pageWidth / 2,
    74,
    { align: 'center' }
  );
  doc.text(
    'dengan ketelitian rasa, penguasaan stoikiometri, dan konsultasi terbimbing Nenek Kebayan.',
    pageWidth / 2,
    80,
    { align: 'center' }
  );

  // Mission Performance Table Box
  const tableY = 90;
  doc.setFillColor(242, 237, 226);
  doc.roundedRect(35, tableY, pageWidth - 70, 52, 3, 3, 'F');
  doc.setDrawColor(92, 122, 92);
  doc.setLineWidth(0.5);
  doc.roundedRect(35, tableY, pageWidth - 70, 52, 3, 3, 'S');

  // Table Headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(92, 122, 92);
  doc.text('Misi Pembelajaran', 45, tableY + 8);
  doc.text('Fokus Kompetensi Kimia', 120, tableY + 8);
  doc.text('Jumlah Percobaan', 225, tableY + 8);

  doc.setDrawColor(180, 180, 180);
  doc.line(40, tableY + 11, pageWidth - 40, tableY + 11);

  // Mission Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  MISSIONS.forEach((m, idx) => {
    const rowY = tableY + 18 + idx * 8;
    const attempts = progress.missionAttempts[m.id] || 1;
    doc.text(`Misi ${m.id}: ${m.title.replace(`Misi ${m.id}: `, '')}`, 45, rowY);
    doc.text(m.topic, 120, rowY);
    doc.text(`${attempts} kali percobaan`, 235, rowY);
  });

  // Footer Info & Signatures
  const footerY = 158;
  const issueDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Left Stamp: Official Seal
  doc.setFillColor(217, 164, 65);
  doc.circle(60, footerY + 15, 14, 'F');
  doc.setFillColor(250, 247, 240);
  doc.circle(60, footerY + 15, 12.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(122, 82, 48);
  doc.text('TABIB RESMI', 60, footerY + 13, { align: 'center' });
  doc.text('LAB NENEK', 60, footerY + 16.5, { align: 'center' });
  doc.text('KEBAYAN', 60, footerY + 20, { align: 'center' });

  // Center: Date & Location
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(`Diterbitkan pada: ${issueDate}`, pageWidth / 2, footerY + 15, { align: 'center' });
  doc.text('Media Pembelajaran Kimia SMA Kelas XI', pageWidth / 2, footerY + 21, { align: 'center' });

  // Right: Signature Nenek Kebayan
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(92, 122, 92);
  doc.text('Nenek Kebayan', 230, footerY + 12, { align: 'center' });
  doc.setDrawColor(92, 122, 92);
  doc.line(200, footerY + 16, 260, footerY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(122, 82, 48);
  doc.text('Tabib Utama & Pembimbing Kimia', 230, footerY + 21, { align: 'center' });

  // Multi-strategy Reliable Download Trigger:
  try {
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 15000);
  } catch {
    // Fallback directly to doc.save
    doc.save(filename);
  }

  return { success: true, filename };
}

/**
 * Generates and downloads high-resolution PNG image of the certificate.
 */
export function generateCertificatePNG(progress: StudentProgress): Promise<{ success: boolean; filename: string }> {
  return new Promise((resolve, reject) => {
    try {
      const studentName = progress.studentName.trim() || 'Murid Laboratorium';
      const cleanName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Sertifikat_Tabib_Kimia_${cleanName}.png`;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // High-res dimensions: 2400 x 1700
      canvas.width = 2400;
      canvas.height = 1700;
      const w = canvas.width;
      const h = canvas.height;

      // Background Parchment
      ctx.fillStyle = '#FAF7F0';
      ctx.fillRect(0, 0, w, h);

      // Outer Green Border
      ctx.strokeStyle = '#5C7A5C';
      ctx.lineWidth = 24;
      ctx.strokeRect(60, 60, w - 120, h - 120);

      // Inner Gold Border
      ctx.strokeStyle = '#D9A441';
      ctx.lineWidth = 8;
      ctx.strokeRect(95, 95, w - 190, h - 190);

      // Corner Ornaments
      ctx.fillStyle = '#D9A441';
      const cSize = 65;
      ctx.fillRect(95, 95, cSize, cSize);
      ctx.fillRect(w - 95 - cSize, 95, cSize, cSize);
      ctx.fillRect(95, h - 95 - cSize, cSize, cSize);
      ctx.fillRect(w - 95 - cSize, h - 95 - cSize, cSize, cSize);

      // Header Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7A5230';
      ctx.font = 'bold 36px Georgia, serif';
      ctx.fillText('LABORATORIUM TRADISIONAL MELAYU & KIMIA ANALITIK', w / 2, 220);

      ctx.fillStyle = '#5C7A5C';
      ctx.font = '900 68px Georgia, serif';
      ctx.fillText('SERTIFIKAT KELULUSAN TABIB KIMIA', w / 2, 320);

      ctx.fillStyle = '#666666';
      ctx.font = 'italic 30px Georgia, serif';
      ctx.fillText('Dengan ini menerangkan bahwa sang penuntut ilmu:', w / 2, 390);

      // Student Name
      ctx.fillStyle = '#7A5230';
      ctx.font = '900 64px Georgia, serif';
      ctx.fillText(studentName.toUpperCase(), w / 2, 490);

      // Golden Line
      ctx.strokeStyle = '#D9A441';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 350, 525);
      ctx.lineTo(w / 2 + 350, 525);
      ctx.stroke();

      // Achievement Description
      ctx.fillStyle = '#3D2413';
      ctx.font = '28px Georgia, serif';
      ctx.fillText(
        'Telah berhasil menyelesaikan seluruh rangkaian 4 Misi Penawar Wabah Kimia (Konsentrasi & Titrasi)',
        w / 2,
        590
      );
      ctx.fillText(
        'dengan ketelitian rasa, penguasaan stoikiometri, dan konsultasi terbimbing Nenek Kebayan.',
        w / 2,
        640
      );

      // Table Box
      const tX = 260;
      const tY = 720;
      const tW = w - 520;
      const tH = 430;

      ctx.fillStyle = '#F2EDE2';
      ctx.fillRect(tX, tY, tW, tH);
      ctx.strokeStyle = '#5C7A5C';
      ctx.lineWidth = 4;
      ctx.strokeRect(tX, tY, tW, tH);

      // Table Header
      ctx.fillStyle = '#5C7A5C';
      ctx.font = 'bold 28px Georgia, serif';
      ctx.textAlign = 'left';
      ctx.fillText('Misi Pembelajaran', tX + 50, tY + 60);
      ctx.fillText('Fokus Kompetensi Kimia', tX + 650, tY + 60);
      ctx.fillText('Jumlah Percobaan', tX + 1350, tY + 60);

      ctx.strokeStyle = '#D9A441';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tX + 30, tY + 85);
      ctx.lineTo(tX + tW - 30, tY + 85);
      ctx.stroke();

      // Rows
      MISSIONS.forEach((m, idx) => {
        const rowY = tY + 150 + idx * 65;
        const attempts = progress.missionAttempts[m.id] || 1;
        ctx.fillStyle = '#3D2413';
        ctx.font = '26px Georgia, serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Misi ${m.id}: ${m.title.replace(`Misi ${m.id}: `, '')}`, tX + 50, rowY);
        ctx.fillText(m.topic, tX + 650, rowY);
        ctx.fillStyle = '#5C7A5C';
        ctx.font = 'bold 26px Georgia, serif';
        ctx.fillText(`${attempts} kali percobaan`, tX + 1350, rowY);
      });

      // Footer
      const footY = 1350;
      const issueDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      // Seal Stamp
      ctx.fillStyle = '#D9A441';
      ctx.beginPath();
      ctx.arc(450, footY + 80, 95, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FAF7F0';
      ctx.beginPath();
      ctx.arc(450, footY + 80, 85, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#7A5230';
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px Georgia, serif';
      ctx.fillText('TABIB RESMI', 450, footY + 60);
      ctx.fillText('LAB NENEK', 450, footY + 85);
      ctx.fillText('KEBAYAN', 450, footY + 110);

      // Center Date
      ctx.fillStyle = '#666666';
      ctx.font = '26px Georgia, serif';
      ctx.fillText(`Diterbitkan pada: ${issueDate}`, w / 2, footY + 70);
      ctx.font = '24px Georgia, serif';
      ctx.fillText('Media Pembelajaran Kimia SMA Kelas XI', w / 2, footY + 110);

      // Right Signature
      ctx.fillStyle = '#5C7A5C';
      ctx.font = 'italic bold 42px Georgia, serif';
      ctx.fillText('Nenek Kebayan', w - 450, footY + 60);

      ctx.strokeStyle = '#5C7A5C';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w - 600, footY + 80);
      ctx.lineTo(w - 300, footY + 80);
      ctx.stroke();

      ctx.fillStyle = '#7A5230';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.fillText('Tabib Utama & Pembimbing Kimia', w - 450, footY + 115);

      // Convert Canvas to Blob & Trigger Download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas blob creation failed');
        }
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 15000);
        resolve({ success: true, filename });
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}
