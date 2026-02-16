const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');
  
  // Blockquotes
  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />');
  
  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
    const cells = content.split('|').map(cell => cell.trim());
    const isHeader = cells.every(cell => /^-+$/.test(cell));
    if (isHeader) return '';
    const tag = 'td';
    const row = cells.map(cell => `<${tag}>${cell}</${tag}>`).join('');
    return `<tr>${row}</tr>`;
  });
  
  // Wrap consecutive table rows
  html = html.replace(/(<tr>.*?<\/tr>\n?)+/g, match => `<table>${match}</table>`);
  
  // Lists
  html = html.replace(/^\- \[ \] (.*)$/gm, '<li class="unchecked">☐ $1</li>');
  html = html.replace(/^\- \[x\] (.*)$/gm, '<li class="checked">☑ $1</li>');
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  
  // Wrap consecutive list items
  html = html.replace(/(<li.*?>.*?<\/li>\n?)+/g, match => `<ul>${match}</ul>`);
  
  // Paragraphs
  html = html.replace(/^(?!<[h|u|o|l|t|p|b|hr]|$)(.+)$/gm, '<p>$1</p>');
  
  return html;
}

const baseStyles = `
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px;
      line-height: 1.6;
      color: #1a1a1a;
      font-size: 11pt;
    }
    h1 { 
      color: #1e3a5f; 
      border-bottom: 3px solid #1e3a5f; 
      padding-bottom: 10px; 
      font-size: 24pt;
      margin-top: 40px;
    }
    h1:first-child { margin-top: 0; }
    h2 { 
      color: #2563eb; 
      margin-top: 30px; 
      font-size: 16pt;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 5px;
    }
    h3 { 
      color: #374151; 
      font-size: 13pt;
      margin-top: 20px;
    }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 15px 0; 
      font-size: 10pt;
    }
    th, td { 
      border: 1px solid #d1d5db; 
      padding: 10px; 
      text-align: left; 
    }
    th { 
      background: #f3f4f6; 
      font-weight: 600; 
    }
    tr:first-child td { 
      background: #f3f4f6; 
      font-weight: 600; 
    }
    tr:nth-child(even) { background: #f9fafb; }
    code { 
      background: #f3f4f6; 
      padding: 2px 6px; 
      border-radius: 4px; 
      font-size: 0.9em; 
      font-family: 'SF Mono', Monaco, 'Courier New', monospace;
    }
    pre { 
      background: #1e293b; 
      color: #e2e8f0; 
      padding: 16px; 
      border-radius: 8px; 
      overflow-x: auto; 
      font-size: 9pt;
      line-height: 1.4;
    }
    pre code { 
      background: none; 
      color: inherit; 
      padding: 0;
    }
    blockquote { 
      border-left: 4px solid #3b82f6; 
      margin: 20px 0; 
      padding: 10px 20px; 
      color: #4b5563; 
      background: #f8fafc;
      font-style: italic;
    }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    ul, ol { padding-left: 25px; margin: 10px 0; }
    li { margin: 5px 0; }
    li.checked { color: #059669; }
    li.unchecked { color: #6b7280; }
    hr { 
      border: none; 
      border-top: 2px solid #e5e7eb; 
      margin: 40px 0; 
    }
    p { margin: 10px 0; }
    img { max-width: 100%; }
    .page-break { page-break-before: always; }
    .cover {
      text-align: center;
      padding: 100px 40px;
    }
    .cover h1 {
      border: none;
      font-size: 36pt;
      color: #1e3a5f;
    }
    .cover h2 {
      border: none;
      color: #4b5563;
      font-size: 18pt;
    }
    .highlight-box {
      background: #eff6ff;
      border: 1px solid #3b82f6;
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
    }
  </style>
`;

async function generatePDF(inputPath, outputPath, title, subtitle) {
  console.log(`Generating ${outputPath}...`);
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Read and convert markdown
  const markdown = fs.readFileSync(inputPath, 'utf8');
  const htmlContent = markdownToHtml(markdown);
  
  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      ${baseStyles}
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;
  
  await page.setContent(fullHtml, { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  await page.pdf({
    path: outputPath,
    format: 'Letter',
    margin: {
      top: '0.75in',
      right: '0.75in',
      bottom: '1in',
      left: '0.75in'
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size: 9px; color: #666; width: 100%; text-align: center; padding: 5px 0;">${title}</div>`,
    footerTemplate: '<div style="font-size: 9px; color: #666; width: 100%; text-align: center; padding: 10px 0;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
  });
  
  await browser.close();
  console.log(`✅ Generated: ${outputPath}`);
}

async function main() {
  const docsDir = __dirname;
  
  // Generate all PDFs
  const documents = [
    {
      input: path.join(docsDir, 'Product-Roadmap-18B-Attorneys.md'),
      output: path.join(docsDir, 'Product-Roadmap-18B-Attorneys.pdf'),
      title: 'Assigned Co-Counsel - Product Roadmap',
      subtitle: 'AI-Powered Practice Management for 18B Attorneys'
    },
    {
      input: path.join(docsDir, 'Funding-Pitch-Deck.md'),
      output: path.join(docsDir, 'Funding-Pitch-Deck.pdf'),
      title: 'Assigned Co-Counsel - Funding Proposal',
      subtitle: 'Investment Opportunity for Access to Justice'
    },
    {
      input: path.join(docsDir, 'Partnership-Strategy.md'),
      output: path.join(docsDir, 'Partnership-Strategy.pdf'),
      title: 'Assigned Co-Counsel - Partnership Strategy',
      subtitle: 'Outreach Plan for Funding and Technology Partners'
    }
  ];
  
  for (const doc of documents) {
    if (fs.existsSync(doc.input)) {
      await generatePDF(doc.input, doc.output, doc.title, doc.subtitle);
    } else {
      console.log(`⚠️ Skipping ${doc.input} (file not found)`);
    }
  }
  
  console.log('\n🎉 All PDFs generated successfully!');
}

main().catch(console.error);
