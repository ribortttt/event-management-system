const MONTH_NAMES = [
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
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SCHEDULE = {
  "2026-9": {
    booked: [5, 6, 10, 20, 28],
    available: [17, 22, 24, 25, 27, 29, 30],
  },
};

const UPCOMING = [
  {
    name: "Birthday Celebration",
    date: "Oct 10, 2026",
    venue: "Riverside Hotel",
    guests: 50,
    color: "#2fb68b",
  },
  {
    name: "Corporate Event",
    date: "Oct 15, 2026",
    venue: "The Grand Plaza",
    guests: 100,
    color: "#3b6cf6",
  },
  {
    name: "Wedding Reception",
    date: "Oct 18, 2026",
    venue: "Crown Hotel",
    guests: 80,
    color: "#f2b315",
  },
  {
    name: "Product Launch",
    date: "Oct 22, 2026",
    venue: "Grand Ballroom",
    guests: 100,
    color: "#ef4a5a",
  },
];

const today = new Date();
let viewYear = 2026;
let viewMonth = 9;

const grid = document.getElementById("calGrid");
const title = document.getElementById("calTitle");

function renderCalendar() {
  title.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
  grid.innerHTML = "";

  DAY_NAMES.forEach((d) => {
    const el = document.createElement("div");
    el.className = "as-dow";
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const status = SCHEDULE[`${viewYear}-${viewMonth}`] || {
    booked: [],
    available: [],
  };

  for (let i = 0; i < firstDay; i++)
    grid.appendChild(document.createElement("div"));

  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement("div");
    el.className = "as-day";
    el.textContent = d;
    if (status.booked.includes(d)) el.classList.add("is-booked");
    if (status.available.includes(d)) el.classList.add("is-available");
    if (
      d === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    ) {
      el.classList.add("is-today");
    }
    grid.appendChild(el);
  }
}

function renderUpcoming() {
  const list = document.getElementById("upcomingList");
  list.innerHTML = UPCOMING.map(
    (e) => `
    <div class="as-event" style="--dot:${e.color}">
      <div>
        <h3>${e.name}</h3>
        <p>${e.date} &bull; ${e.venue}</p>
        <p>${e.guests} guests</p>
      </div>
      <a href="#" class="as-view">View</a>
    </div>`,
  ).join("");
}

function changeMonth(step) {
  viewMonth += step;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  renderCalendar();
}

document
  .getElementById("prevMonth")
  .addEventListener("click", () => changeMonth(-1));
document
  .getElementById("nextMonth")
  .addEventListener("click", () => changeMonth(1));

renderCalendar();
renderUpcoming();
