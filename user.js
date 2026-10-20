/* SHARED DATA LAYER */
(function (global) {
  "use strict";

  const VERSION = "2";

  const KEYS = {
    version: "ems_version",
    user: "ems_user",
    categories: "ems_categories",
    venues: "ems_venues",
    bookings: "ems_bookings",
    latest: "ems_latest_booking",
  };

  const SEED_USER = {
    name: "Clariza Anucop",
    phone: "+63 912 345 6789",
    email: "Clariza@gmail.com",
  };

  const SEED_CATEGORIES = [
    {
      id: "birthdays",
      name: "Birthdays",
      title: "Birthday Celebration",
      icon: "fa-solid fa-cake-candles",
      color: "et-pink",
      tagline: "Celebrate another year in style",
      image: "images/birthday.jpg",
    },
    {
      id: "weddings",
      name: "Weddings",
      title: "Wedding Reception",
      icon: "fa-solid fa-ring",
      color: "et-violet",
      tagline: "Your dream day, our priority",
      image: "images/wedding.jpg",
    },
    {
      id: "corporate",
      name: "Corporate Events",
      title: "Corporate Event",
      icon: "fa-solid fa-briefcase",
      color: "et-blue",
      tagline: "Professional events for your business",
      image: "images/event.jpg",
    },
    {
      id: "debut",
      name: "Debut",
      title: "Debut Celebration",
      icon: "fa-solid fa-crown",
      color: "et-gold",
      tagline: "A milestone worth celebrating",
      image: "images/birthday.jpg",
    },
    {
      id: "anniversary",
      name: "Anniversary",
      title: "Anniversary Celebration",
      icon: "fa-regular fa-heart",
      color: "et-green",
      tagline: "Cherish every moment",
      image: "images/wedding.jpg",
    },
    {
      id: "launch",
      name: "Product Launch",
      title: "Product Launch",
      icon: "fa-solid fa-rocket",
      color: "et-rose",
      tagline: "Make a lasting impression",
      image: "images/event.jpg",
    },
    {
      id: "other",
      name: "Other",
      title: "Special Event",
      icon: "fa-solid fa-ellipsis",
      color: "et-indigo",
      tagline: "Let's create something unique",
      image: "images/event.jpg",
    },
  ];

  const SEED_VENUES = [
    {
      id: "riverside",
      name: "Riverside Hotel",
      area: "Pasig Area",
      capacity: 100,
      price: "80,000-120,000",
      type: "Indoor & Outdoor",
      image: "images/availability.jpg",
      blockedDates: ["2026-10-17", "2026-10-24", "2026-10-31"],
    },
    {
      id: "garden",
      name: "Garden Pavilion",
      area: "Quezon City",
      capacity: 150,
      price: "50,000-90,000",
      type: "Outdoor",
      image: "images/Royal.jpg",
      blockedDates: ["2026-10-10", "2026-10-11", "2026-10-25"],
    },
    {
      id: "grandhall",
      name: "Grand Hall",
      area: "Makati Area",
      capacity: 300,
      price: "120,000-200,000",
      type: "Indoor",
      image: "images/Luxury.jpg",
      blockedDates: ["2026-10-16", "2026-10-23", "2026-10-30"],
    },
    {
      id: "grandplaza",
      name: "The Grand Plaza",
      area: "Manila Area",
      capacity: 200,
      price: "60,000-100,000",
      type: "Banquet Hall",
      image: "images/birthday.jpg",
      blockedDates: [],
    },
    {
      id: "crown",
      name: "Crown Hotel",
      area: "Mandaluyong Area",
      capacity: 200,
      price: "100,000-150,000",
      type: "Indoor",
      image: "images/event.jpg",
      blockedDates: [],
    },
  ];

  const SEED_BOOKINGS = [
    {
      id: "BK-001",
      eventType: "Weddings",
      eventTitle: "Wedding Reception",
      date: "2026-10-26",
      venueId: "riverside",
      venue: "Riverside Hotel",
      guests: 100,
      budget: "80,000-120,000",
      status: "pending",
      image: "images/wedding.jpg",
      details: "Theme: Classic & Elegant",
      clientName: "Clariza Anucop",
      phone: "+63 912 345 6789",
      email: "Clariza@gmail.com",
      userEmail: "Clariza@gmail.com",
      adminNote: "",
      participants: [],
      createdAt: "2026-10-01T09:00:00.000Z",
    },
    {
      id: "BK-002",
      eventType: "Birthdays",
      eventTitle: "Birthday Celebration",
      date: "2026-11-16",
      venueId: "grandplaza",
      venue: "The Grand Plaza",
      guests: 50,
      budget: "30,000-50,000",
      status: "confirmed",
      image: "images/birthday.jpg",
      details: "Theme: Tropical",
      clientName: "Clariza Anucop",
      phone: "+63 912 345 6789",
      email: "Clariza@gmail.com",
      userEmail: "Clariza@gmail.com",
      adminNote: "",
      participants: [],
      createdAt: "2026-10-03T09:00:00.000Z",
    },
    {
      id: "BK-003",
      eventType: "Corporate Events",
      eventTitle: "Corporate Event",
      date: "2026-12-10",
      venueId: "crown",
      venue: "Crown Hotel",
      guests: 120,
      budget: "100,000-150,000",
      status: "declined",
      image: "images/event.jpg",
      details: "Year-end company party",
      clientName: "Clariza Anucop",
      phone: "+63 912 345 6789",
      email: "Clariza@gmail.com",
      userEmail: "Clariza@gmail.com",
      adminNote: "The venue is already reserved on that date.",
      participants: [],
      createdAt: "2026-10-05T09:00:00.000Z",
    },
    {
      id: "BK-004",
      eventType: "Anniversary",
      eventTitle: "Anniversary Celebration",
      date: "2026-11-28",
      venueId: "garden",
      venue: "Garden Pavilion",
      guests: 80,
      budget: "50,000 – 100,000",
      status: "pending",
      image: "images/wedding.jpg",
      details: "Garden dinner",
      clientName: "Jamielyn Paralijas",
      phone: "+63 912 345 6789",
      email: "Jamielyn@gmail.com",
      userEmail: "Jamielyn@gmail.com",
      adminNote: "",
      participants: [],
      createdAt: "2026-10-08T09:00:00.000Z",
    },
  ];

  const read = (k, fallback) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v === null || v === undefined ? fallback : v;
    } catch (e) {
      return fallback;
    }
  };
  const write = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
      console.error("EMS storage error:", e);
    }
  };

  function seed() {
    if (localStorage.getItem(KEYS.version) !== VERSION) {
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(KEYS.version, VERSION);
    }
    if (!localStorage.getItem(KEYS.user)) write(KEYS.user, SEED_USER);
    if (!localStorage.getItem(KEYS.categories))
      write(KEYS.categories, SEED_CATEGORIES);
    if (!localStorage.getItem(KEYS.venues)) write(KEYS.venues, SEED_VENUES);
    if (!localStorage.getItem(KEYS.bookings))
      write(KEYS.bookings, SEED_BOOKINGS);
  }
  seed();

  const pad = (n) => String(n).padStart(2, "0");
  const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const EMS = {
    KEYS,

    escapeHtml(s) {
      return String(s === null || s === undefined ? "" : s).replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );
    },
    todayISO() {
      const d = new Date();
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    },
    formatDate(iso) {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
      if (!m) return iso || "";
      return `${MONTHS_SHORT[+m[2] - 1]} ${+m[3]}, ${m[1]}`;
    },

    getUser: () => read(KEYS.user, SEED_USER),
    saveUser: (u) => write(KEYS.user, u),

    getCategories: () => read(KEYS.categories, []),
    saveCategories: (list) => write(KEYS.categories, list),
    getCategory(nameOrId) {
      return (
        EMS.getCategories().find(
          (c) => c.name === nameOrId || c.id === nameOrId,
        ) || null
      );
    },

    getVenues: () => read(KEYS.venues, []),
    saveVenues: (list) => write(KEYS.venues, list),
    getVenue(idOrName) {
      return (
        EMS.getVenues().find((v) => v.id === idOrName || v.name === idOrName) ||
        null
      );
    },

    getBookings: () => read(KEYS.bookings, []),
    saveBookings: (list) => write(KEYS.bookings, list),
    getBooking: (id) => EMS.getBookings().find((b) => b.id === id) || null,
    getUserBookings(email) {
      const e = String(email || "").toLowerCase();
      return EMS.getBookings().filter(
        (b) => String(b.userEmail || b.email).toLowerCase() === e,
      );
    },
    addBooking(data) {
      const all = EMS.getBookings();
      const next =
        all.reduce(
          (m, b) =>
            Math.max(m, parseInt(String(b.id).replace(/\D/g, ""), 10) || 0),
          0,
        ) + 1;
      const booking = Object.assign(
        {
          status: "pending",
          adminNote: "",
          participants: [],
          createdAt: new Date().toISOString(),
        },
        data,
        { id: "BK-" + String(next).padStart(3, "0") },
      );
      all.push(booking);
      EMS.saveBookings(all);
      return booking;
    },
    updateBooking(id, patch) {
      const all = EMS.getBookings();
      const i = all.findIndex((b) => b.id === id);
      if (i < 0) return null;
      all[i] = Object.assign({}, all[i], patch);
      EMS.saveBookings(all);
      return all[i];
    },
    setStatus(id, status, adminNote) {
      const patch = { status };
      if (adminNote !== undefined) patch.adminNote = adminNote;
      return EMS.updateBooking(id, patch);
    },
    deleteBooking(id) {
      EMS.saveBookings(EMS.getBookings().filter((b) => b.id !== id));
    },
    setLatest: (id) => write(KEYS.latest, id),
    getLatest: () => read(KEYS.latest, null),

    getUnavailableDates(venueId) {
      const v = EMS.getVenue(venueId);
      if (!v) return [];
      const set = new Set(v.blockedDates || []);
      EMS.getBookings().forEach((b) => {
        if (
          b.status === "confirmed" &&
          (b.venueId === v.id || b.venue === v.name)
        )
          set.add(b.date);
      });
      return Array.from(set);
    },
    isDateAvailable(venueId, iso) {
      return EMS.getUnavailableDates(venueId).indexOf(iso) === -1;
    },

    getParticipants() {
      const out = [];
      EMS.getBookings().forEach((b) =>
        (b.participants || []).forEach((p, index) =>
          out.push(
            Object.assign({}, p, {
              bookingId: b.id,
              index,
              eventTitle: b.eventTitle,
              date: b.date,
              venue: b.venue,
            }),
          ),
        ),
      );
      return out;
    },
    addParticipant(bookingId, participant) {
      const b = EMS.getBooking(bookingId);
      if (!b) return null;
      return EMS.updateBooking(bookingId, {
        participants: (b.participants || []).concat([participant]),
      });
    },
    removeParticipant(bookingId, index) {
      const b = EMS.getBooking(bookingId);
      if (!b) return null;
      const list = (b.participants || []).slice();
      list.splice(index, 1);
      return EMS.updateBooking(bookingId, { participants: list });
    },

    getSummary() {
      const bookings = EMS.getBookings();
      const today = EMS.todayISO();
      const byStatus = { pending: 0, confirmed: 0, declined: 0 };
      const byCategory = {};
      const byVenue = {};
      let totalGuests = 0,
        confirmedGuests = 0,
        namedParticipants = 0;
      bookings.forEach((b) => {
        byStatus[b.status] = (byStatus[b.status] || 0) + 1;
        byCategory[b.eventType] = (byCategory[b.eventType] || 0) + 1;
        byVenue[b.venue] = (byVenue[b.venue] || 0) + 1;
        const g = Number(b.guests) || 0;
        totalGuests += g;
        if (b.status === "confirmed") confirmedGuests += g;
        namedParticipants += (b.participants || []).length;
      });
      return {
        totalBookings: bookings.length,
        totalVenues: EMS.getVenues().length,
        totalCategories: EMS.getCategories().length,
        byStatus,
        byCategory,
        byVenue,
        totalGuests,
        confirmedGuests,
        namedParticipants,
        upcomingEvents: bookings
          .filter((b) => b.status === "confirmed" && b.date >= today)
          .sort((a, b) => a.date.localeCompare(b.date)),
      };
    },
  };

  global.EMS = EMS;
})(window);

/* CUSTOMER PAGES*/
document.addEventListener("DOMContentLoaded", () => {
  const E = window.EMS;

  const esc = E.escapeHtml;
  const $ = (id) => document.getElementById(id);
  const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
  const params = new URLSearchParams(window.location.search);
  const user = E.getUser();

  document.querySelectorAll(".mb-greeting").forEach((el) => {
    el.textContent = "Hi, " + user.name.split(" ")[0] + "!";
  });

  const etGrid = document.querySelector(".et-grid");
  if (etGrid) {
    etGrid.innerHTML = E.getCategories()
      .map(
        (c) => `
      <a href="eventdetails.html?type=${encodeURIComponent(c.name)}" class="et-card">
        <span class="et-icon ${esc(c.color)}"><i class="${esc(c.icon)}"></i></span>
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.tagline)}</p>
        <i class="fa-solid fa-arrow-right et-arrow"></i>
      </a>`,
      )
      .join("");
  }

  /*  Booking form   */
  const form = document.querySelector(".ed-form");
  if (form) {
    const typeSel = $("event-type"),
      dateIn = $("event-date"),
      venueSel = $("venue");
    const guestsIn = $("guests"),
      budgetSel = $("budget"),
      detailsIn = $("details");
    const cats = E.getCategories(),
      venues = E.getVenues();

    typeSel.innerHTML =
      `<option value="" disabled selected>Select event type</option>` +
      cats
        .map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`)
        .join("");
    venueSel.innerHTML =
      `<option value="" disabled selected>Select venue</option>` +
      venues
        .map(
          (v) =>
            `<option value="${esc(v.id)}">${esc(v.name)} (${esc(v.area)})</option>`,
        )
        .join("");

    const pType = params.get("type"),
      pVenue = params.get("venue"),
      pDate = params.get("date");
    if (pType && cats.some((c) => c.name === pType)) typeSel.value = pType;
    if (pVenue && venues.some((v) => v.id === pVenue)) venueSel.value = pVenue;
    if (pDate && /^\d{4}-\d{2}-\d{2}$/.test(pDate)) {
      dateIn.type = "date";
      dateIn.value = pDate;
    }
    dateIn.min = E.todayISO();

    const clearErrors = () => {
      dateIn.setCustomValidity("");
      guestsIn.setCustomValidity("");
    };
    [dateIn, venueSel, guestsIn].forEach((el) => {
      el.addEventListener("input", clearErrors);
      el.addEventListener("change", clearErrors);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const venue = E.getVenue(venueSel.value);
      const cat = E.getCategory(typeSel.value);
      const guests = parseInt(guestsIn.value, 10);
      if (!venue || !cat) return;

      if (dateIn.value < E.todayISO()) {
        dateIn.setCustomValidity("Please choose today or a future date.");
      } else if (!E.isDateAvailable(venue.id, dateIn.value)) {
        dateIn.setCustomValidity(
          venue.name +
            " is not available on " +
            E.formatDate(dateIn.value) +
            ". Please pick another date or venue.",
        );
      } else if (guests > venue.capacity) {
        guestsIn.setCustomValidity(
          venue.name + " can only hold " + venue.capacity + " guests.",
        );
      }
      if (!form.reportValidity()) return;

      const booking = E.addBooking({
        eventType: cat.name,
        eventTitle: cat.title,
        date: dateIn.value,
        venueId: venue.id,
        venue: venue.name,
        guests: guests,
        budget: budgetSel.value,
        details: detailsIn.value.trim() || "No special requests",
        image: cat.image,
        clientName: user.name,
        phone: user.phone,
        email: user.email,
        userEmail: user.email,
      });
      E.setLatest(booking.id);
      window.location.href = "submitted.html";
    });
  }

  /* Submitted page */
  const submittedCard = document.querySelector(".bs-card");
  if (submittedCard) {
    const b = E.getBooking(E.getLatest());
    if (b) {
      submittedCard.innerHTML = `
        <div class="bs-item"><span class="bs-label">Reference:</span><span class="bs-value">${esc(b.id)}</span></div>
        <div class="bs-item"><span class="bs-label">Event Type:</span><span class="bs-value">${esc(b.eventType)}</span></div>
        <div class="bs-item"><span class="bs-label">Date:</span><span class="bs-value">${esc(E.formatDate(b.date))}</span></div>
        <div class="bs-item"><span class="bs-label">Venue:</span><span class="bs-value">${esc(b.venue)}</span></div>
        <div class="bs-item"><span class="bs-label">Guests:</span><span class="bs-value">${esc(b.guests)}</span></div>
        <div class="bs-item bs-budget"><span class="bs-label">Budget:</span><span class="bs-value">${esc(b.budget)}</span></div>
      `;
    }
  }

  /*  My Bookings page  */
  const mbList = document.querySelector(".mb-list");
  if (mbList) {
    let filter = "all";

    const render = () => {
      const mine = E.getUserBookings(user.email);
      const items =
        filter === "all" ? mine : mine.filter((b) => b.status === filter);

      if (!items.length) {
        mbList.innerHTML = `<p style="padding:20px;text-align:center;color:#64748b;">No bookings found for this category.</p>`;
        return;
      }

      mbList.innerHTML = items
        .map(
          (b) => `
        <article class="mb-card" data-status="${esc(b.status)}">
          <div class="mb-thumb" role="img" aria-label="${esc(b.eventTitle)}"><img src="${esc(b.image || "images/event.jpg")}" alt=""></div>
          <div class="mb-info">
            <h3>${esc(b.eventTitle)}</h3>
            <ul class="mb-meta">
              <li><i class="fa-regular fa-calendar"></i><span>${esc(E.formatDate(b.date))}</span></li>
              <li><i class="fa-solid fa-location-dot"></i><span>${esc(b.venue)}</span></li>
              <li><i class="fa-solid fa-user-group"></i><span>${esc(b.guests)} Guests</span></li>
            </ul>
            <p class="mb-budget"><strong>Budget:</strong> ${esc(b.budget)}</p>
          </div>
          <div class="mb-side">
            <span class="mb-badge mb-${esc(b.status)}">${esc(cap(b.status))}</span>
            <a href="bookingdetails.html?id=${encodeURIComponent(b.id)}" class="mb-view">View Details</a>
          </div>
        </article>`,
        )
        .join("");
    };

    const tabs = document.querySelectorAll(".mb-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        filter = tab.getAttribute("data-filter");
        render();
      });
    });
    render();
  }

  /*  Booking Details page  */
  const bdPage = document.querySelector(".bd-page");
  if (bdPage) {
    const b = E.getBooking(params.get("id"));
    if (!b) {
      window.location.replace("mybookings.html");
      return;
    }

    document.querySelector(".bd-summary-info h1").textContent = b.eventTitle;
    document.querySelector(".bd-meta").innerHTML = `
      <li><i class="fa-solid fa-calendar-days"></i><span>${esc(E.formatDate(b.date))}</span></li>
      <li><i class="fa-solid fa-location-dot"></i><span>${esc(b.venue)}</span></li>
      <li><i class="fa-solid fa-user-group"></i><span>${esc(b.guests)} Guests</span></li>
      <li><i class="fa-solid fa-wallet"></i><span>${esc(b.budget)}</span></li>`;

    const badge = document.querySelector(".bd-badge");
    badge.className = `mb-badge mb-${b.status} bd-badge`;
    badge.textContent = cap(b.status);

    const img = document.querySelector(".bd-photo img");
    if (img) img.src = b.image || "images/event.jpg";

    document.querySelector(".bd-event-details").innerHTML = `
      <h2>Event Details</h2>
      <p>Event Type: ${esc(b.eventType)}</p>
      <p>Notes: ${esc(b.details)}</p>`;

    document.querySelector(".bd-contact ul").innerHTML = `
      <li><i class="fa-regular fa-user"></i><span>${esc(b.clientName)}</span></li>
      <li><i class="fa-solid fa-phone"></i><span>${esc(b.phone)}</span></li>
      <li><i class="fa-regular fa-envelope"></i><span>${esc(b.email)}</span></li>`;

    const panels = {
      pending: {
        icon: "fa-regular fa-clock",
        title: "Waiting for Approval",
        text: "Your booking is currently under review.<br>We will notify you once it's confirmed<br>or declined.",
      },
      confirmed: {
        icon: "fa-regular fa-circle-check",
        title: "Booking Confirmed",
        text: "Your booking has been confirmed.<br>We look forward to making your<br>event unforgettable!",
      },
      declined: {
        icon: "fa-regular fa-circle-xmark",
        title: "Booking Declined",
        text: "Unfortunately we couldn't accommodate<br>this booking. Please contact us or<br>try another date or venue.",
      },
    };
    const p = panels[b.status] || panels.pending;
    const panel = document.querySelector(".bd-status");
    panel.querySelector(".bd-status-icon i").className = p.icon;
    panel.querySelector("h2").textContent = p.title;
    panel.querySelector("p").innerHTML =
      p.text +
      (b.adminNote
        ? `<br><br><em>Note from EventPro: ${esc(b.adminNote)}</em>`
        : "");
    if (b.status === "declined") {
      const btn = panel.querySelector(".bd-status-button");
      btn.textContent = "Check Availability";
      btn.href =
        "availability.html?venue=" + encodeURIComponent(b.venueId || "");
    }
  }
});

/* VENUE AVAILABILITY CALENDAR*/

document.addEventListener("DOMContentLoaded", function () {
  const E = window.EMS;
  if (!document.getElementById("calDays")) return; // only runs on availability.html

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

  const VENUES = E.getVenues();
  if (!VENUES.length) {
    $("vcName").textContent = "No venues available";
    return;
  }

  const pad = (n) => String(n).padStart(2, "0");
  const key = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  const todayKey = E.todayISO();

  let start = new Date();
  if (start.getFullYear() < FIRST_YEAR) start = new Date(FIRST_YEAR, 0, 1);
  if (start.getFullYear() > LAST_YEAR) start = new Date(LAST_YEAR, 11, 31);

  const wanted = new URLSearchParams(location.search).get("venue");
  const state = {
    venue: VENUES.find((v) => v.id === wanted) || VENUES[0],
    year: start.getFullYear(),
    month: start.getMonth(),
    day: start.getDate(),
  };

  VENUES.forEach((v) => venueSel.add(new Option(v.name, v.id)));
  venueSel.value = state.venue.id;
  MONTHS.forEach((m, i) => monthSel.add(new Option(m, i)));
  for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) yearSel.add(new Option(y, y));

  function renderVenue() {
    const v = state.venue;
    $("vcName").textContent = v.name;
    $("vcPrice").textContent = v.price;
    $("vcArea").textContent = v.area;
    $("vcGuests").textContent = v.capacity + " Guests";
    $("vcType").textContent = v.type;
    const img = $("vcImg");
    img.alt = v.name;
    img.style.display = "";
    img.onerror = () => {
      img.style.display = "none";
    };
    img.src = v.image;
  }

  function renderCalendar() {
    monthSel.value = state.month;
    yearSel.value = state.year;
    daysEl.innerHTML = "";

    const unavailable = new Set(E.getUnavailableDates(state.venue.id));
    const firstWeekday = new Date(state.year, state.month, 1).getDay();
    const total = new Date(state.year, state.month + 1, 0).getDate();

    for (let i = 0; i < firstWeekday; i++)
      daysEl.appendChild(document.createElement("span"));

    for (let d = 1; d <= total; d++) {
      const k = key(state.year, state.month, d);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "va-day";
      btn.textContent = d;

      if (k < todayKey) {
        btn.disabled = true;
        btn.title = "Past date";
        btn.style.opacity = ".4";
      } else if (unavailable.has(k)) {
        btn.disabled = true;
        btn.classList.add("is-booked");
        btn.title = "Not available";
      } else if (state.day === d) {
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

    const sel = state.day ? key(state.year, state.month, state.day) : "";
    const open = sel && sel >= todayKey && !unavailable.has(sel);
    $("vcLink").href =
      "eventdetails.html?venue=" +
      encodeURIComponent(state.venue.id) +
      (open ? "&date=" + sel : "");
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
});
