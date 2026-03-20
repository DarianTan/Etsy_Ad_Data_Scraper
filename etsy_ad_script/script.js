(() => {
  const table = document.querySelector('#listings-header > table');

  if (!table) {
    console.error('Table not found at #listings-header > table');
    return;
  }

  const rows = Array.from(table.querySelectorAll('tbody tr'));

  const cleanText = (value) => {
    if (!value) return '';
    return value.replace(/\s+/g, ' ').trim();
  };

  const csvEscape = (value) => {
    const str = String(value ?? '');
    return `"${str.replace(/"/g, '""')}"`;
  };

  const dataset = rows.map((row, index) => {
    const listingCell = row.querySelector('td');
    const listingLink = listingCell?.querySelector('a');
    const listingImg = listingCell?.querySelector('img');
    const adToggle = row.querySelector('input[type="checkbox"]');
    const cells = row.querySelectorAll('td, th');

    return {
      rowIndex: index,
      listing: cleanText(listingLink?.innerText),
      listingUrl: listingLink
        ? new URL(listingLink.getAttribute('href'), location.origin).href
        : '',
      imageUrl: listingImg?.src || '',
      adOn: adToggle ? adToggle.checked : '',
      views: cleanText(cells[2]?.innerText),
      clicks: cleanText(cells[3]?.innerText),
      clickRate: cleanText(cells[4]?.innerText),
      orders: cleanText(cells[5]?.innerText),
      revenue: cleanText(cells[6]?.innerText),
      spend: cleanText(cells[7]?.innerText),
      roas: cleanText(cells[8]?.innerText)
    };
  });

  if (!dataset.length) {
    console.warn('No table rows found.');
    return;
  }

  const headers = [
    'rowIndex',
    'listing',
    'listingUrl',
    'imageUrl',
    'adOn',
    'views',
    'clicks',
    'clickRate',
    'orders',
    'revenue',
    'spend',
    'roas'
  ];

  const csvRows = [
    headers.map(csvEscape).join(','),
    ...dataset.map(row =>
      headers.map(header => csvEscape(row[header])).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '-',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0')
  ].join('');

  const a = document.createElement('a');
  a.href = url;
  a.download = `etsy_ads_export_${timestamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  console.log(`Exported ${dataset.length} rows to CSV.`);
  console.log(dataset);
})();