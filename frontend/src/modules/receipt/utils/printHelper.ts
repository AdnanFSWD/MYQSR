/**
 * Dynamic iframe printing utility.
 * Renders the receipt HTML into a hidden iframe and triggers browser print
 * to isolate receipt printing from the main dashboard UI.
 */
export const printReceiptFromHTML = (htmlContent: string): void => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: white;
              color: black;
            }
            @page {
              margin: 0;
            }
            @media print {
              html, body {
                width: 80mm;
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    doc.close();

    // Small delay to ensure styles and contents are bound in DOM before printing
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    }, 400);
  }
};
export default printReceiptFromHTML;
