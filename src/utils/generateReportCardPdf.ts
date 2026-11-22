import { jsPDF } from 'jspdf';
import { ExamResult } from '../types';

export function generateReportCardPdf(report: ExamResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

  // Outer Border & Background
  doc.setDrawColor(6, 182, 212); // Cyan border
  doc.setLineWidth(1.2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setDrawColor(203, 213, 225); // Slate inner border
  doc.setLineWidth(0.3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Header Banner
  doc.setFillColor(15, 23, 42); // Deep navy #0f172a
  doc.rect(10, 10, pageWidth - 20, 32, 'F');

  // Title
  doc.setTextColor(245, 158, 11); // Amber
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('WEEKLY EXAM REPORT CARD', pageWidth / 2, 23, { align: 'center' });

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Jarvis AI Smart Learning & Diagnostic Assessment', pageWidth / 2, 31, { align: 'center' });

  // Student Info Bar
  let y = 48;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 22, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, y, pageWidth - 28, 22);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Student Name:`, 18, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.studentName || 'Student'}`, 48, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.text(`Class / Grade:`, 18, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.grade || 'Class 1'}`, 48, y + 16);

  const examDateDisplay = report.date || new Date().toLocaleDateString('en-GB');
  doc.setFont('helvetica', 'bold');
  doc.text(`Exam Date:`, pageWidth / 2 + 10, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${examDateDisplay}`, pageWidth / 2 + 36, y + 8);

  // Compute next exam date (7 days later)
  let nextExamDateDisplay = '';
  try {
    const parts = examDateDisplay.split('/');
    let examDateObj: Date;
    if (parts.length === 3) {
      examDateObj = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    } else {
      examDateObj = new Date(examDateDisplay);
    }
    if (isNaN(examDateObj.getTime())) examDateObj = new Date();
    const nextExamObj = new Date(examDateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
    nextExamDateDisplay = nextExamObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (_) {
    nextExamDateDisplay = '7 days after current exam';
  }

  doc.setFont('helvetica', 'bold');
  doc.text(`Next Exam:`, pageWidth / 2 + 10, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(`${nextExamDateDisplay}`, pageWidth / 2 + 36, y + 16);

  // Score Summary Cards
  y = 78;
  const cardWidth = (pageWidth - 28 - 12) / 3;

  // Card 1: Marks
  doc.setFillColor(239, 246, 255); // Light blue
  doc.setDrawColor(59, 130, 246);
  doc.roundedRect(14, y, cardWidth, 24, 2, 2, 'FD');
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TOTAL MARKS', 14 + cardWidth / 2, y + 7, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${report.correctAnswers} / ${report.totalQuestions}`, 14 + cardWidth / 2, y + 17, { align: 'center' });

  // Card 2: Percentage
  doc.setFillColor(240, 253, 244); // Light green
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(14 + cardWidth + 6, y, cardWidth, 24, 2, 2, 'FD');
  doc.setTextColor(21, 128, 61);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SCORE PERCENT', 14 + cardWidth + 6 + cardWidth / 2, y + 7, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${report.scorePercent}%`, 14 + cardWidth + 6 + cardWidth / 2, y + 17, { align: 'center' });

  // Card 3: Grade
  doc.setFillColor(254, 243, 199); // Light amber
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(14 + (cardWidth + 6) * 2, y, cardWidth, 24, 2, 2, 'FD');
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('FINAL GRADE', 14 + (cardWidth + 6) * 2 + cardWidth / 2, y + 7, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${report.gradeLetter || 'A'}`, 14 + (cardWidth + 6) * 2 + cardWidth / 2, y + 17, { align: 'center' });

  // Section Heading: Doubt Clearing & Mistakes Breakdown
  y = 112;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('DOUBT CLEARING & RE-LEARNING TOPICS', 14, y);

  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.6);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 8;
  const mistakes = report.mistakes || [];

  if (mistakes.length === 0) {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'FD');
    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Excellent Performance! All answers were 100% correct!', pageWidth / 2, y + 11, { align: 'center' });
    y += 26;
  } else {
    mistakes.forEach((m, idx) => {
      if (y > pageHeight - 50) {
        doc.addPage();
        y = 20;
      }

      doc.setFillColor(255, 241, 242); // Rose tint
      doc.setDrawColor(244, 63, 94);
      doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'FD');

      doc.setTextColor(159, 18, 57);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Q${idx + 1}: ${m.question}`, 18, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      if (m.studentAnswer) {
        doc.text(`Student Answer: ${m.studentAnswer}`, 22, y + 13);
      }

      doc.setTextColor(21, 128, 61);
      doc.setFont('helvetica', 'bold');
      doc.text(`Correct Answer: ${m.correctAnswer}`, 22, y + 19);

      y += 28;
    });
  }

  // Teacher Remarks Box
  if (y > pageHeight - 55) {
    doc.addPage();
    y = 20;
  }

  y = Math.max(y + 4, 190);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text("Jarvis Teacher's Guidance & Next Steps:", 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const adviceLines = [
    `• Review the mistakes noted above during daily syllabus study sessions.`,
    `• Weekly exams are conducted strictly every 7 days. Next exam is on ${nextExamDateDisplay}.`,
    `• Keep practicing daily blackboard reading and writing to maintain high marks!`
  ];
  adviceLines.forEach((line, i) => {
    doc.text(line, 20, y + 14 + (i * 5));
  });

  // Footer & Official Stamp
  const footerY = pageHeight - 20;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Officially generated by Jarvis AI Teacher • Safe, verified educational assessment', 14, footerY);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 14, footerY, { align: 'right' });

  // Trigger download as clean .pdf file
  const safeName = (report.studentName || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeGrade = (report.grade || 'Class-1').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Weekly-Exam-Report-Card-${safeGrade}-${safeName}.pdf`);
}
