document.addEventListener("DOMContentLoaded", () => {
  let bookings = JSON.parse(localStorage.getItem("ems_bookings"));
  if (!bookings) {
    bookings = [
      {
        id: "BK-001",
        clientName: "Maria Santos",
        email: "maria@gmail.com",
        eventTitle: "Wedding Reception",
        eventType: "Wedding",
        date: "Oct 25, 2026",
        venue: "Riverside Hotel",
        guests: 100,
        budget: "80,000 - 120,000",
        status: "confirmed",
        image: "images/wedding.jpg",
      },
      {
        id: "BK-002",
        clientName: "Juan Dela Cruz",
        email: "juan@gmail.com",
        eventTitle: "Birthday Celebration",
        eventType: "Social",
        date: "Nov 15, 2026",
        venue: "The Grand Plaza",
        guests: 50,
        budget: "30,000 - 50,000",
        status: "confirmed",
        image: "images/birthday.jpg",
      },
      {
        id: "BK-003",
        clientName: "Julia dela Cruz",
        email: "julia@gmail.com",
        eventTitle: "Corporate Event",
        eventType: "Corporate",
        date: "Dec 10, 2026",
        venue: "Crown Hotel",
        guests: 120,
        budget: "100,000 - 150,000",
        status: "pending",
        image: "images/event.jpg",
      },
    ];
    localStorage.setItem("ems_bookings", JSON.stringify(bookings));
  }

  const sTotal = document.getElementById("sTotal");
  const sUpcoming = document.getElementById("sUpcoming");
  const sGuests = document.getElementById("sGuests");
  const sPending = document.getElementById("sPending");

  if (sTotal) {
    const totalBookings = bookings.length;
    const upcomingEvents = bookings.filter(
      (b) => b.status === "confirmed",
    ).length;
    const totalGuests = bookings.reduce(
      (sum, b) => sum + parseInt(b.guests || 0),
      0,
    );
    const pendingCount = bookings.filter((b) => b.status === "pending").length;

    sTotal.textContent = totalBookings;
    if (sUpcoming) sUpcoming.textContent = upcomingEvents;
    if (sGuests) sGuests.textContent = totalGuests;
    if (sPending) sPending.textContent = pendingCount;
  }

  const bookingRows = document.getElementById("bookingRows");
  if (bookingRows) {
    bookingRows.innerHTML = "";
    bookings
      .slice(-5)
      .reverse()
      .forEach((b, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${b.id || "BK-00" + index}</td>
        <td><strong>${b.clientName || "Guest"}</strong></td>
        <td>${b.eventType || b.eventTitle}</td>
        <td>${b.date}</td>
        <td><span class="ae-badge ${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
        <td><button onclick="viewBookingDetail('${b.id}')" class="ae-view" style="background:none;border:none;cursor:pointer;">View</button></td>
      `;
        bookingRows.appendChild(tr);
      });
  }

  const eventRows = document.getElementById("eventRows");
  if (eventRows) {
    eventRows.innerHTML = "";
    bookings.forEach((b) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img class="ae-thumb" src="${b.image || "images/event.jpg"}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:4px;"></td>
        <td>${b.eventTitle || b.eventType}</td>
        <td>${b.eventType || "General"}</td>
        <td>${b.date}</td>
        <td>${b.venue}</td>
        <td><span class="ae-badge ${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
        <td><a href="#" class="ae-view">View</a></td>
      `;
      eventRows.appendChild(tr);
    });
  }

  const guestRows = document.getElementById("guestRows");
  if (guestRows) {
    guestRows.innerHTML = "";
    bookings.forEach((b) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${b.clientName || "Anonymous"}</td>
        <td>${b.email || "N/A"}</td>
        <td>${b.eventTitle || b.eventType}</td>
        <td><span class="ag-badge registered">Registered</span></td>
        <td><span class="ag-rsvp yes">Yes (${b.guests} Pax)</span></td>
      `;
      guestRows.appendChild(tr);
    });
  }
});

function viewBookingDetail(id) {
  let bookings = JSON.parse(localStorage.getItem("ems_bookings")) || [];
  let selected = bookings.find((b) => b.id === id);
  if (selected) {
    alert(
      `Viewing Booking: ${selected.eventTitle}\nClient: ${selected.clientName}\nVenue: ${selected.venue}\nStatus: ${selected.status.toUpperCase()}`,
    );
  }
}
