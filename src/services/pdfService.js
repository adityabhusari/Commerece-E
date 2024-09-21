const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generateInvoice = (orderDetails, outputPath) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(outputPath));

    doc.fontSize(25).text('Invoice', { align: 'center' });
    doc.fontSize(18).text(`Order ID: ${orderDetails.orderId}`, { align: 'left' });
    doc.text(`Customer Name: ${orderDetails.customerName}`, { align: 'left' });
    doc.text(`Amount Paid: $${orderDetails.amount}`, { align: 'left' });

    // Add more invoice details as needed

    doc.end();
};
