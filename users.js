document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("ems_bookings")) {
    const initialBookings = [
      {
        id: "BK-001",
        eventTitle: "Wedding Reception",
        eventType: "Weddings",
        date: "2026-10-26",
        venue: "Riverside Hotel",
        guests: 100,
        budget: "80,000-120,000",
        status: "pending",
        image: "images/wedding.jpg",
        details: "Theme: Classic & Elegant",
        clientName: "Maria Santos",
        phone: "+63 912 345 6789",
        email: "maria@gmail.com",
      },
      {
        id: "BK-002",
        eventTitle: "Birthday Celebration",
        eventType: "Birthdays",
        date: "2026-11-16",
        venue: "The Grand Plaza",
        guests: 50,
        budget: "30,000-50,000",
        status: "confirmed",
        image: "images/birthday.jpg",
        details: "Theme: Tropical",
        clientName: "Maria Santos",
        phone: "+63 912 345 6789",
        email: "maria@gmail.com",
      },
    ];
    localStorage.setItem("ems_bookings", JSON.stringify(initialBookings));
  }

  if (!localStorage.getItem("ems_venues")) {
    const venues = [
      {
        id: "v1",
        name: "Riverside Hotel",
        location: "Makati",
        capacity: 200,
        price: "₱50,000 / day",
        area: "Makati City",
        image: "images/availability.jpg",
        type: "Indoor & Outdoor",
      },
      {
        id: "v2",
        name: "Grand Ballroom",
        location: "Pasig",
        capacity: 150,
        price: "₱40,000 / day",
        area: "Pasig City",
        image: "images/event.jpg",
        type: "Indoor",
      },
      {
        id: "v3",
        name: "The Grand Plaza",
        location: "Manila",
        capacity: 300,
        price: "₱80,000 / day",
        area: "Manila",
        image: "images/birthday.jpg",
        type: "Banquet Hall",
      },
    ];
    localStorage.setItem("ems_venues", JSON.stringify(venues));
  }

  const bookingForm = document.querySelector(".ed-form");
  if (bookingForm) {
    const venueSelect = document.getElementById("venue");
    if (venueSelect) {
      const storedVenues = JSON.parse(localStorage.getItem("ems_venues")) || [];
      venueSelect.innerHTML = `<option value="" disabled selected>Select venue</option>`;
      storedVenues.forEach((v) => {
        const opt = document.createElement("option");
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.location})`;
        venueSelect.appendChild(opt);
      });
    }

    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const eventTypeVal = document.getElementById("event-type").value;
      const newBooking = {
        id: "BK-" + Math.floor(100 + Math.random() * 900),
        eventType: eventTypeVal,
        eventTitle: eventTypeVal + " Celebration",
        date: document.getElementById("event-date").value,
        venue: document.getElementById("venue").value,
        guests: document.getElementById("guests").value,
        budget: document.getElementById("budget").value,
        details:
          document.getElementById("details").value || "No special requests",
        status: "pending",
        image: "images/wedding.jpg",
        clientName: "Maria Santos",
        phone: "+63 912 345 6789",
        email: "maria@gmail.com",
      };

      let bookings = JSON.parse(localStorage.getItem("ems_bookings")) || [];
      bookings.push(newBooking);
      localStorage.setItem("ems_bookings", JSON.stringify(bookings));
      localStorage.setItem("latest_booking", JSON.stringify(newBooking));

      window.location.href = "submitted.html";
    });
  }

  const submittedCard = document.querySelector(".bs-card");
  if (submittedCard) {
    const latest = JSON.parse(localStorage.getItem("latest_booking"));
    if (latest) {
      submittedCard.innerHTML = `
        <div class="bs-item"><span class="bs-label">Event Type:</span><span class="bs-value">${latest.eventType}</span></div>
        <div class="bs-item"><span class="bs-label">Date:</span><span class="bs-value">${latest.date}</span></div>
        <div class="bs-item"><span class="bs-label">Venue:</span><span class="bs-value">${latest.venue}</span></div>
        <div class="bs-item"><span class="bs-label">Guests:</span><span class="bs-value">${latest.guests}</span></div>
        <div class="bs-item bs-budget"><span class="bs-label">Budget:</span><span class="bs-value">${latest.budget}</span></div>
      `;
    }
  }

  const mbList = document.querySelector(".mb-list");
  if (mbList) {
    const bookings = JSON.parse(localStorage.getItem("ems_bookings")) || [];

    function renderBookings(filter = "all") {
      mbList.innerHTML = "";
      const filtered =
        filter === "all"
          ? bookings
          : bookings.filter((b) => b.status === filter);

      if (filtered.length === 0) {
        mbList.innerHTML = `<p style="padding: 20px; text-align: center; color: #64748b;">No bookings found for this category.</p>`;
        return;
      }

      filtered.forEach((b) => {
        const card = document.createElement("article");
        card.className = "mb-card";
        card.setAttribute("data-status", b.status);
        card.innerHTML = `
          <div class="mb-thumb" role="img"><img src="${b.image || "images/event.jpg"}" alt=""></div>
          <div class="mb-info">
            <h3>${b.eventTitle}</h3>
            <ul class="mb-meta">
              <li><i class="fa-regular fa-calendar"></i><span>${b.date}</span></li>
              <li><i class="fa-solid fa-location-dot"></i><span>${b.venue}</span></li>
              <li><i class="fa-solid fa-user-group"></i><span>${b.guests} Guests</span></li>
            </ul>
            <p class="mb-budget"><strong>Budget:</strong> ${b.budget}</p>
          </div>
          <div class="mb-side">
            <span class="mb-badge mb-${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
            <button class="mb-view" data-id="${b.id}" style="background:none;border:none;cursor:pointer;color:inherit;font-weight:600;">View Details</button>
          </div>
        `;
        mbList.appendChild(card);
      });

      document.querySelectorAll(".mb-view").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const bookingId = e.target.getAttribute("data-id");
          const selectedBooking = bookings.find(
            (item) => item.id === bookingId,
          );
          localStorage.setItem(
            "current_view_booking",
            JSON.stringify(selectedBooking),
          );
          window.location.href = "bookingdetails.html";
        });
      });
    }

    renderBookings("all");

    const tabs = document.querySelectorAll(".mb-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        renderBookings(tab.getAttribute("data-filter"));
      });
    });
  }

  const bdPage = document.querySelector(".bd-page");
  if (bdPage) {
    const detailData = JSON.parse(localStorage.getItem("current_view_booking"));
    if (detailData) {
      document.querySelector(".bd-summary-info h1").textContent =
        detailData.eventTitle;
      document.querySelector(".bd-meta").innerHTML = `
        <li><i class="fa-solid fa-calendar-days"></i><span>${detailData.date}</span></li>
        <li><i class="fa-solid fa-location-dot"></i><span>${detailData.venue}</span></li>
        <li><i class="fa-solid fa-user-group"></i><span>${detailData.guests} Guests</span></li>
        <li><i class="fa-solid fa-wallet"></i><span>${detailData.budget}</span></li>
      `;
      const badge = document.querySelector(".bd-badge");
      if (badge) {
        badge.className = `mb-badge mb-${detailData.status} bd-badge`;
        badge.textContent =
          detailData.status.charAt(0).toUpperCase() +
          detailData.status.slice(1);
      }
      const eventDetailsSec = document.querySelector(".bd-event-details");
      if (eventDetailsSec) {
        eventDetailsSec.innerHTML = `
          <h2>Event Details</h2>
          <p>Notes: ${detailData.details}</p>
        `;
      }
      const bdImg = document.querySelector(".bd-photo img");
      if (bdImg) bdImg.src = detailData.image || "images/wedding.jpg";
    }
  }

  if (page === "submitted.html") {
  const params = new URLSearchParams(window.location.search);

  const bookingFields = {
    "Event Type:": "event_type",
    "Date:": "event_date",
    "Venue:": "venue",
    "Guests:": "guests",
    "Budget:": "budget"
  };

  document.querySelectorAll(".bs-item").forEach(function (item) {
    const label = item.querySelector(".bs-label");
    const value = item.querySelector(".bs-value");

    if (!label || !value) return;

    const key = bookingFields[label.textContent.trim()];

    if (key && params.has(key) && params.get(key)) {
      value.textContent = params.get(key);
    }
  });
}
});
