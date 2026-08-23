import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PDFDocument = require('pdfkit');

export const generatePdf = async (data: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      info: {
        Author: 'Vortex AI',
        Title: data?.title,
        Creator: 'Vortex AI',
      },
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (error: Error) => reject(error));

    if (data) {
      if (data.title) {
        doc.fillColor('#1E1B4B').fontSize(22).text(data.title, { align: 'center' });
        doc.moveDown(0.5);
      }
      if (data.subtitle) {
        doc.fillColor('#475569').fontSize(14).text(data.subtitle, { align: 'center' });
        doc.moveDown(1.5);
      }
      if (Array.isArray(data.sections)) {
        data.sections.forEach((section: any) => {
          if (section.heading) {
            doc.fillColor('#4F46E5').fontSize(16).text(section.heading);
            doc.moveDown(0.5);
          }
          if (Array.isArray(section.points)) {
            section.points.forEach((point: string) => {
              doc.fillColor('#334155').fontSize(11).text(`• ${point}`, {
                indent: 10,
                lineGap: 3,
              });
            });
            doc.moveDown(0.8);
          }
        });
      }
    }

    doc.end();
  });
};
