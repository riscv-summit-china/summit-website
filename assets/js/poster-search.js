window.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('#poster-arrangements');
  if (!section) return;
  const input = section.querySelector('#poster-search');
  const rows = [...section.querySelectorAll('tbody tr')];
  const noResults = section.querySelector('.poster-no-results');
  const normalize = (text) => text.normalize('NFKC').toLocaleLowerCase().trim();
  const searchable = rows.map((row) => normalize(row.dataset.search));
  section.querySelector('.poster-search').hidden = false;
  input.addEventListener('input', () => {
    const terms = normalize(input.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    rows.forEach((row, index) => {
      row.hidden = !terms.every((term) => searchable[index].includes(term));
      if (!row.hidden) visible++;
    });
    noResults.hidden = visible !== 0;
  });
});
