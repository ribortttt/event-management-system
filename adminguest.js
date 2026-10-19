const search = document.getElementById("guestSearch");
const statusFilter = document.getElementById("statusFilter");
const rsvpFilter = document.getElementById("rsvpFilter");
const rows = document.querySelectorAll("#guestRows tr");

function filterGuests() {
  const q = search.value.trim().toLowerCase();
  rows.forEach(row => {
    const cells = row.children;
    const matchText = row.textContent.toLowerCase().includes(q);
    const matchStatus = !statusFilter.value || cells[3].textContent.trim() === statusFilter.value;
    const matchRsvp = !rsvpFilter.value || cells[4].textContent.trim() === rsvpFilter.value;
    row.style.display = matchText && matchStatus && matchRsvp ? "" : "none";
  });
}

[search, statusFilter, rsvpFilter].forEach(el => el.addEventListener("input", filterGuests));