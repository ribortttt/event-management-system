   const search = document.getElementById('eventSearch');
    const category = document.getElementById('categoryFilter');
    const status = document.getElementById('statusFilter');
    const rows = document.querySelectorAll('#eventRows tr');

    function filterEvents() {
      const q = search.value.trim().toLowerCase();
      rows.forEach(row => {
        const c = row.children;
        const matchText = row.textContent.toLowerCase().includes(q);
        const matchCat = !category.value || c[2].textContent === category.value;
        const matchStatus = !status.value || c[5].textContent.trim() === status.value;
        row.style.display = matchText && matchCat && matchStatus ? '' : 'none';
      });
    }

    [search, category, status].forEach(el => el.addEventListener('input', filterEvents));