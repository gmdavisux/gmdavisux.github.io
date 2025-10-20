console.log('Fetching data');
fetch('js/more.json')
  .then(response => response.json())
  .then(data => {
    console.log('Fetched data:', data);
    const container = document.createElement('div');
    container.className = 'container';

    const row = document.createElement('div');
    row.className = 'row pb-5';

    data.forEach(item => {
      const col = document.createElement('div');
      col.className = 'col-md-3 py-2';

      const a = document.createElement('a');
      a.setAttribute('data-bs-theme', 'dark');
      a.href = '/' + item.url + "&set=more";
      a.textContent = item.name;

      col.appendChild(a);
      row.appendChild(col);
    });

    container.appendChild(row);
    document.body.appendChild(container);
  })
