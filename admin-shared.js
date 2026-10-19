
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const STORAGE_KEY = "ems_bookings";
  let bookings;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    bookings = saved ? JSON.parse(saved) : null;

    if (!Array.isArray(bookings)) {
      bookings = null;
    }
  } catch (error) {
    console.error("Could not read bookings:", error);
    bookings = null;
  }

  if (!bookings) {
    bookings = [
      {
        id: "BK-001",
        clientName: "Maria Santos",
        email: "maria@gmail.com",
        eventTitle: "Wedding Reception",
        eventType: "Wedding",
        date: "2026-10-25",
        venue: "Riverside Hotel",
        guests: 100,
        status: "confirmed",
        revenue: 100000
      },
      {
        id: "BK-002",
        clientName: "Juan Dela Cruz",
        email: "juan@gmail.com",
        eventTitle: "Birthday Celebration",
        eventType: "Social",
        date: "2026-11-15",
        venue: "The Grand Plaza",
        guests: 50,
        status: "confirmed",
        revenue: 40000
      },
      {
        id: "BK-003",
        clientName: "Julia dela Cruz",
        email: "julia@gmail.com",
        eventTitle: "Corporate Event",
        eventType: "Corporate",
        date: "2026-12-10",
        venue: "Crown Hotel",
        guests: 120,
        status: "pending",
        revenue: 120000
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  const $ = id => document.getElementById(id);

  const normalizeStatus = booking =>
    String(booking.status || "pending").toLowerCase();

  const validDate = booking => {
    const value = String(booking.date || "");
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? value
      : "";

    if (iso) return iso;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";

    return [
      parsed.getFullYear(),
      String(parsed.getMonth() + 1).padStart(2, "0"),
      String(parsed.getDate()).padStart(2, "0")
    ].join("-");
  };

  const eventName = b =>
    b.eventTitle || b.eventType || "Untitled Event";

  const customerName = b =>
    b.clientName || b.contact?.name || "Guest";

  const guestCount = b => {
    const value = Number(b.guests);
    return Number.isFinite(value) && value > 0 ? value : 0;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayISO = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  const upcoming = bookings.filter(b =>
    normalizeStatus(b) === "confirmed" &&
    validDate(b) >= todayISO
  );

  const pending = bookings.filter(b =>
    normalizeStatus(b) === "pending"
  );

  const confirmed = bookings.filter(b =>
    normalizeStatus(b) === "confirmed"
  );

  const totalGuests = bookings.reduce(
    (sum, b) => sum + guestCount(b), 0
  );

  if ($("sTotal")) $("sTotal").textContent = bookings.length;
  if ($("sUpcoming")) $("sUpcoming").textContent = upcoming.length;
  if ($("sGuests")) $("sGuests").textContent = totalGuests;
  if ($("sPending")) $("sPending").textContent = pending.length;

  if ($("nTotal")) {
    $("nTotal").textContent = confirmed.length + " confirmed";
  }

  if ($("nUpcoming")) {
    $("nUpcoming").textContent = upcoming.length
      ? "Next: " + formatDate(validDate(
          upcoming.slice().sort((a, b) =>
            validDate(a).localeCompare(validDate(b))
          )[0]
        ))
      : "No upcoming events";
  }

  if ($("nGuests")) {
    $("nGuests").textContent = totalGuests + " expected guests";
  }

  if ($("rTotalEvents")) {
    $("rTotalEvents").textContent = bookings.length;
  }

  if ($("rTotalGuests")) {
    $("rTotalGuests").textContent = totalGuests;
  }

  if ($("rPending")) {
    $("rPending").textContent = pending.length;
  }

  if ($("rRevenue")) {
    const hasRevenue = bookings.some(b =>
      b.revenue !== undefined &&
      b.revenue !== null &&
      b.revenue !== "" &&
      Number.isFinite(Number(b.revenue))
    );

    const revenue = bookings.reduce((sum, b) => {
      const amount = Number(b.revenue);
      return sum + (
        Number.isFinite(amount) && amount > 0 ? amount : 0
      );
    }, 0);

    $("rRevenue").textContent = hasRevenue
      ? "₱" + revenue.toLocaleString("en-PH")
      : "Not tracked";
  }

  const bookingRows = $("bookingRows");

  if (bookingRows) {
    const recent = bookings.slice().reverse().slice(0, 5);

    bookingRows.innerHTML = recent.length
      ? recent.map(b => `
          <tr>
            <td>${escapeHTML(b.id || "—")}</td>
            <td>${escapeHTML(customerName(b))}</td>
            <td>${escapeHTML(eventName(b))}</td>
            <td>${escapeHTML(formatDate(validDate(b)))}</td>
            <td>
              <span class="pill pill-${escapeHTML(normalizeStatus(b))}">
                ${escapeHTML(capitalize(normalizeStatus(b)))}
              </span>
            </td>
            <td>
              <a class="btn-view"
                 href="bookingdetails.html?id=${encodeURIComponent(b.id || "")}&admin=1">
                View
              </a>
            </td>
          </tr>
        `).join("")
      : '<tr><td colspan="6">No bookings yet.</td></tr>';
  }

  const eventRows = $("eventRows");

  if (eventRows) {
    eventRows.innerHTML = bookings.length
      ? bookings.map(b => `
          <tr>
            <td>
              <img class="ae-thumb"
                   src="${escapeHTML(b.image || "images/event.jpg")}"
                   alt=""
                   width="40" height="40">
            </td>
            <td>${escapeHTML(eventName(b))}</td>
            <td>${escapeHTML(b.eventType || "General")}</td>
            <td>${escapeHTML(formatDate(validDate(b)))}</td>
            <td>${escapeHTML(b.venue || "—")}</td>
            <td>
              <span class="ae-badge ${escapeHTML(normalizeStatus(b))}">
                ${escapeHTML(capitalize(normalizeStatus(b)))}
              </span>
            </td>
            <td>
              <a class="ae-view"
                 href="bookingdetails.html?id=${encodeURIComponent(b.id || "")}&admin=1">
                View
              </a>
            </td>
          </tr>
        `).join("")
      : '<tr><td colspan="7">No events yet.</td></tr>';
  }

  const guestRows = $("guestRows");

  if (guestRows) {
    guestRows.innerHTML = bookings.length
      ? bookings.map(b => `
          <tr>
            <td>${escapeHTML(customerName(b))}</td>
            <td>${escapeHTML(b.email || "N/A")}</td>
            <td>${escapeHTML(eventName(b))}</td>
            <td>
              <span class="ag-badge ${
                normalizeStatus(b) === "pending"
                  ? "pending" : "registered"
              }">
                ${normalizeStatus(b) === "pending"
                  ? "Pending" : "Registered"}
              </span>
            </td>
            <td>
              <span class="ag-rsvp yes">
                ${guestCount(b)} Pax
              </span>
            </td>
          </tr>
        `).join("")
      : '<tr><td colspan="5">No guests yet.</td></tr>';
  }

  function formatDate(value) {
    if (!value) return "—";

    const parts = value.split("-");
    if (parts.length !== 3) return value;

    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function capitalize(value) {
    return value
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : "";
  }
});
