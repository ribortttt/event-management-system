const search = document.getElementById("venueSearch");
const statusFilter = document.getElementById("statusFilter");
const locationFilter = document.getElementById("locationFilter");
const rows = document.querySelectorAll("#venueRows tr");

function filterVenues() {
  const q = search.value.trim().toLowerCase();
  rows.forEach(row => {
    const cells = row.children;
    const matchText = row.textContent.toLowerCase().includes(q);
    const matchStatus = !statusFilter.value || cells[5].textContent.trim() === statusFilter.value;
    const matchLocation = !locationFilter.value || cells[2].textContent.trim() === locationFilter.value;
    row.style.display = matchText && matchStatus && matchLocation ? "" : "none";
  });
}

[search, statusFilter, locationFilter].forEach(el => el.addEventListener("input", filterVenues));