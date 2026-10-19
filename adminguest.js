document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const STORAGE_KEY = "ems_bookings";

  const $ = (id) => document.getElementById(id);

  const searchInput = $("guestSearch");
  const statusFilter = $("guestStatusFilter");
  const rsvpFilter = $("rsvpFilter");
  const rowsElement = $("guestRows");
  const resultCount = $("guestResultCount");

  let bookings = [];

  function readBookings() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Unable to read guest bookings:", error);
      return [];
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char];
    });
  }

  function statusOf(booking) {
    return String(booking.status || "pending").toLowerCase();
  }

  function nameOf(booking) {
    return (
      booking.clientName || (booking.contact && booking.contact.name) || "Guest"
    );
  }

  function emailOf(booking) {
    return booking.email || (booking.contact && booking.contact.email) || "N/A";
  }

  function eventOf(booking) {
    return (
      booking.eventTitle ||
      booking.eventType ||
      booking.title ||
      "Untitled Event"
    );
  }

  function guestsOf(booking) {
    const number = Number(booking.guests);
    return Number.isFinite(number) && number > 0 ? number : 0;
  }

  function rsvpOf(booking) {
    const value = String(booking.rsvp || "").toLowerCase();

    if (["yes", "confirmed", "accepted"].includes(value)) return "yes";
    if (["no", "declined", "rejected"].includes(value)) return "no";

    if (statusOf(booking) === "pending") return "pending";

    return "yes";
  }

  function registrationStatus(booking) {
    const status = statusOf(booking);

    if (status === "pending") return "pending";
    if (status === "declined") return "declined";

    return "registered";
  }

  function updateSummary() {
    $("guestBookingCount").textContent = bookings.length;

    $("guestTotalCount").textContent = bookings.reduce(
      (sum, booking) => sum + guestsOf(booking),
      0,
    );

    $("guestRegisteredCount").textContent = bookings.filter(
      (booking) => registrationStatus(booking) === "registered",
    ).length;

    $("guestPendingCount").textContent = bookings.filter(
      (booking) => registrationStatus(booking) === "pending",
    ).length;
  }

  function filteredBookings() {
    const query = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const rsvp = rsvpFilter.value;

    return bookings.filter((booking) => {
      const searchable = [
        booking.id,
        nameOf(booking),
        emailOf(booking),
        eventOf(booking),
        booking.venue,
      ]
        .join(" ")
        .toLowerCase();

      if (query && !searchable.includes(query)) return false;

      if (status && registrationStatus(booking) !== status) {
        return false;
      }

      if (rsvp && rsvpOf(booking) !== rsvp) {
        return false;
      }

      return true;
    });
  }

  function render() {
    const filtered = filteredBookings();

    if (filtered.length === 0) {
      rowsElement.innerHTML = `
        <tr>
          <td colspan="7" class="ag-empty">
            No guests found. Try changing your search or filters.
          </td>
        </tr>
      `;
    } else {
      rowsElement.innerHTML = filtered
        .map((booking) => {
          const status = registrationStatus(booking);
          const rsvp = rsvpOf(booking);

          return `
          <tr>
            <td>${escapeHTML(nameOf(booking))}</td>
            <td>${escapeHTML(emailOf(booking))}</td>
            <td>${escapeHTML(eventOf(booking))}</td>
            <td>${guestsOf(booking)}</td>
            <td>
              <span class="ag-badge ${escapeHTML(status)}">
                ${escapeHTML(capitalize(status))}
              </span>
            </td>
            <td>
              <span class="ag-rsvp ${escapeHTML(rsvp)}">
                ${escapeHTML(capitalize(rsvp))}
              </span>
            </td>
            <td>
              <a
                class="ag-view"
                href="bookingdetails.html?id=${encodeURIComponent(booking.id || "")}&admin=1"
              >View</a>
            </td>
          </tr>
        `;
        })
        .join("");
    }

    resultCount.textContent = `Showing ${filtered.length} of ${bookings.length} bookings`;
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function refresh() {
    bookings = readBookings();
    updateSummary();
    render();
  }

  searchInput.addEventListener("input", render);
  statusFilter.addEventListener("change", render);
  rsvpFilter.addEventListener("change", render);

  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY) refresh();
  });

  $("addGuestBtn").addEventListener("click", function () {
    alert(
      "To add a guest, create or update a booking first. " +
        "The guest list will use the saved booking details.",
    );
  });

  refresh();
});
