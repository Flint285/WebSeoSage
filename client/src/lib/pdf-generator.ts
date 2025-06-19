import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { SeoAnalysis } from '@shared/schema';

export class PdfGenerator {
  static async generateSeoReport(analysis: SeoAnalysis): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to add new page if needed
    const checkPageBreak = (neededHeight: number) => {
      if (yPosition + neededHeight > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SEO Analysis Report', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Website: ${analysis.url}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Analysis Date: ${new Date(analysis.createdAt).toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;

    // Overall Score Section
    checkPageBreak(40);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Overall SEO Score', 20, yPosition);
    yPosition += 10;

    // Score circle (simplified as text)
    pdf.setFontSize(36);
    const scoreColor = analysis.overallScore >= 80 ? [0, 166, 81] : 
                      analysis.overallScore >= 60 ? [255, 107, 53] : [231, 76, 60];
    pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.text(`${analysis.overallScore}`, 20, yPosition);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    const scoreLabel = analysis.overallScore >= 80 ? 'Excellent' : 
                      analysis.overallScore >= 60 ? 'Good' : 
                      analysis.overallScore >= 40 ? 'Needs Work' : 'Poor';
    pdf.text(scoreLabel, 45, yPosition);
    yPosition += 20;

    // Summary Statistics
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary Statistics', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`✓ Passed Checks: ${analysis.passedChecks}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`✗ Failed Checks: ${analysis.failedChecks}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`⚡ Page Speed: ${analysis.pageSpeed}`, 20, yPosition);
    yPosition += 15;

    // Category Breakdown
    checkPageBreak(60);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Category Breakdown', 20, yPosition);
    yPosition += 12;

    const categories = [
      { name: 'Technical SEO', score: analysis.technicalScore },
      { name: 'Content Quality', score: analysis.contentScore },
      { name: 'Performance', score: analysis.performanceScore },
      { name: 'User Experience', score: analysis.uxScore }
    ];

    categories.forEach(category => {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(category.name, 20, yPosition);
      
      const categoryColor = category.score >= 80 ? [0, 166, 81] : 
                           category.score >= 60 ? [255, 107, 53] : [231, 76, 60];
      pdf.setTextColor(categoryColor[0], categoryColor[1], categoryColor[2]);
      pdf.text(`${category.score}/100`, pageWidth - 40, yPosition);
      pdf.setTextColor(0, 0, 0);
      
      // Progress bar
      const barWidth = 80;
      const barHeight = 3;
      const barX = pageWidth - 40 - barWidth;
      const barY = yPosition + 2;
      
      // Background bar
      pdf.setFillColor(240, 240, 240);
      pdf.rect(barX, barY, barWidth, barHeight, 'F');
      
      // Progress bar
      pdf.setFillColor(categoryColor[0], categoryColor[1], categoryColor[2]);
      pdf.rect(barX, barY, (barWidth * category.score) / 100, barHeight, 'F');
      
      yPosition += 12;
    });

    yPosition += 10;

    // Issues Section
    const issues = analysis.issues as any[];
    if (issues.length > 0) {
      checkPageBreak(80);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Critical Issues', 20, yPosition);
      yPosition += 12;

      issues.slice(0, 5).forEach((issue, index) => {
        checkPageBreak(25);
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${issue.title}`, 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Wrap text for description
        const splitDescription = pdf.splitTextToSize(issue.description, pageWidth - 40);
        pdf.text(splitDescription, 25, yPosition);
        yPosition += splitDescription.length * 4 + 5;
        
        // Priority badge
        const priorityColor = issue.priority === 'high' ? [231, 76, 60] : 
                             issue.priority === 'medium' ? [255, 107, 53] : [149, 165, 166];
        pdf.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
        pdf.text(`Priority: ${issue.priority.toUpperCase()}`, 25, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 10;
      });
    }

    // Recommendations Section
    const recommendations = analysis.recommendations as any[];
    if (recommendations.length > 0) {
      checkPageBreak(80);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Top Recommendations', 20, yPosition);
      yPosition += 12;

      recommendations
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 5)
        .forEach((rec, index) => {
          checkPageBreak(25);
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${index + 1}. ${rec.title}`, 20, yPosition);
          yPosition += 8;
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          
          // Wrap text for description
          const splitDescription = pdf.splitTextToSize(rec.description, pageWidth - 40);
          pdf.text(splitDescription, 25, yPosition);
          yPosition += splitDescription.length * 4 + 5;
          
          // Impact score
          pdf.setTextColor(0, 166, 81);
          pdf.text(`Estimated Score Increase: +${rec.estimatedScoreIncrease}`, 25, yPosition);
          pdf.setTextColor(0, 0, 0);
          yPosition += 10;
        });
    }

    // Footer
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated by SEO Analyzer Pro - Page ${i} of ${totalPages}`, 
               pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Save the PDF
    const domain = (() => {
      try {
        return new URL(analysis.url).hostname;
      } catch {
        return 'website';
      }
    })();
    const fileName = `seo-report-${domain}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  static async generateAdvancedReport(analysis: SeoAnalysis): Promise<void> {
    // Create a temporary div for rendering
    const reportElement = document.createElement('div');
    reportElement.style.position = 'absolute';
    reportElement.style.left = '-9999px';
    reportElement.style.width = '800px';
    reportElement.style.backgroundColor = 'white';
    reportElement.style.padding = '40px';
    reportElement.style.fontFamily = 'Arial, sans-serif';
    
    reportElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #0066CC; font-size: 28px; margin-bottom: 10px;">SEO Analysis Report</h1>
        <p style="font-size: 16px; color: #666;">${analysis.url}</p>
        <p style="font-size: 14px; color: #999;">${new Date(analysis.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="display: inline-block; width: 150px; height: 150px; border: 12px solid #E5E7EB; border-radius: 50%; position: relative;">
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
            <div style="font-size: 36px; font-weight: bold; color: ${analysis.overallScore >= 80 ? '#00A651' : analysis.overallScore >= 60 ? '#FF6B35' : '#E74C3C'}">${analysis.overallScore}</div>
            <div style="font-size: 14px; color: #666;">${analysis.overallScore >= 80 ? 'Excellent' : analysis.overallScore >= 60 ? 'Good' : analysis.overallScore >= 40 ? 'Needs Work' : 'Poor'}</div>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #00A651; margin-bottom: 10px;">✓ Passed Checks</h3>
          <div style="font-size: 24px; font-weight: bold;">${analysis.passedChecks}</div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #E74C3C; margin-bottom: 10px;">✗ Issues Found</h3>
          <div style="font-size: 24px; font-weight: bold;">${analysis.failedChecks}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(reportElement);
    
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const domain = (() => {
        try {
          return new URL(analysis.url).hostname;
        } catch {
          return 'website';
        }
      })();
      const fileName = `seo-report-${domain}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } finally {
      document.body.removeChild(reportElement);
    }
  }
}