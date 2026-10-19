const VENUES = [
  {
    id: "riverside",
    name: "Riverside Hotel",
    price: "80,000-120,000",
    area: "Pasig Area",
    guests: "100 Guests",
    type: "Indoor & Outdoor",
    img: "images/availability.jpg",
    booked: ["2026-10-17", "2026-10-24", "2026-10-31"],
  },
  {
    id: "garden",
    name: "Garden Pavilion",
    price: "50,000-90,000",
    area: "Quezon City",
    guests: "150 Guests",
    type: "Outdoor",
    img: "images/venue-2.jpg",
    booked: ["2026-10-10", "2026-10-11", "2026-10-25"],
  },
  {
    id: "grandhall",
    name: "Grand Hall",
    price: "120,000-200,000",
    area: "Makati Area",
    guests: "300 Guests",
    type: "Indoor",
    img: "images/venue-3.jpg",
    booked: ["2026-10-16", "2026-10-23", "2026-10-30"],
  },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const FIRST_YEAR = 2026,
  LAST_YEAR = 2030;

const $ = (id) => document.getElementById(id);
const venueSel = $("venue"),
  monthSel = $("calMonth"),
  yearSel = $("calYear"),
  daysEl = $("calDays");
const inDay = $("inDay"),
  inMonth = $("inMonth"),
  inYear = $("inYear");

const state = { venue: VENUES[0], year: 2026, month: 9, day: 9 };

const pad = (n) => String(n).padStart(2, "0");
const key = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

VENUES.forEach((v) => venueSel.add(new Option(v.name, v.id)));
MONTHS.forEach((m, i) => monthSel.add(new Option(m, i)));
for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) yearSel.add(new Option(y, y));

function renderVenue() {
  const v = state.venue;
  $("vcName").textContent = v.name;
  $("vcPrice").textContent = v.price;
  $("vcArea").textContent = v.area;
  $("vcGuests").textContent = v.guests;
  $("vcType").textContent = v.type;
  const img = $("vcImg");
  img.alt = v.name;
  img.style.display = "";
  img.onerror = () => {
    img.style.display = "none";
  };
  img.src = v.img;
  $("vcLink").href = "eventdetails.html?venue=" + v.id;
}

function renderCalendar() {
  monthSel.value = state.month;
  yearSel.value = state.year;
  daysEl.innerHTML = "";

  const firstWeekday = new Date(state.year, state.month, 1).getDay();
  const total = new Date(state.year, state.month + 1, 0).getDate();

  for (let i = 0; i < firstWeekday; i++)
    daysEl.appendChild(document.createElement("span"));

  for (let d = 1; d <= total; d++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "va-day";
    btn.textContent = d;

    const booked = state.venue.booked.includes(key(state.year, state.month, d));
    if (booked) {
      btn.disabled = true;
      btn.classList.add("is-booked");
      btn.title = "Not available";
    }
    if (state.day === d) {
      btn.classList.add("is-selected");
      btn.setAttribute("aria-pressed", "true");
    }
    btn.addEventListener("click", () => {
      state.day = d;
      syncInputs();
      renderCalendar();
    });
    daysEl.appendChild(btn);
  }
}

function syncInputs() {
  inDay.value = state.day ? pad(state.day) : "";
  inMonth.value = pad(state.month + 1);
  inYear.value = state.year;
}

function readInputs() {
  const d = parseInt(inDay.value, 10),
    m = parseInt(inMonth.value, 10),
    y = parseInt(inYear.value, 10);
  if (!d || !m || !y || inYear.value.length < 4) return;
  if (y < FIRST_YEAR || y > LAST_YEAR || m < 1 || m > 12) return;
  if (d < 1 || d > new Date(y, m, 0).getDate()) return;
  state.year = y;
  state.month = m - 1;
  state.day = d;
  renderCalendar();
}

venueSel.addEventListener("change", () => {
  state.venue = VENUES.find((v) => v.id === venueSel.value);
  renderVenue();
  renderCalendar();
});
monthSel.addEventListener("change", () => {
  state.month = +monthSel.value;
  state.day = null;
  syncInputs();
  renderCalendar();
});
yearSel.addEventListener("change", () => {
  state.year = +yearSel.value;
  state.day = null;
  syncInputs();
  renderCalendar();
});
[inDay, inMonth, inYear].forEach((i) =>
  i.addEventListener("input", () => {
    i.value = i.value.replace(/\D/g, "");
    readInputs();
  }),
);

renderVenue();
syncInputs();
renderCalendar();
