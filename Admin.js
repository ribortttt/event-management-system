(function () {
  "use strict";

  const E = window.EMS;
  if (!E) {
    console.error("admin.js needs user.js to load first.");
    return;
  }

  const $ = (id) => document.getElementById(id);
  const esc = E.escapeHtml;
  const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
  const pad = (n) => String(n).padStart(2, "0");
  const page = document.body.getAttribute("data-page");
  const params = new URLSearchParams(location.search);

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
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const BUDGETS = [
    "Below 30,000",
    "30,000-50,000",
    "50,000-100,000",
    "100,000-150,000",
    "150,000-200,000",
    "Above 200,000",
  ];
  const COLORS = [
    ["et-pink", "Pink"],
    ["et-violet", "Violet"],
    ["et-blue", "Blue"],
    ["et-gold", "Gold"],
    ["et-green", "Green"],
    ["et-rose", "Rose"],
    ["et-indigo", "Indigo"],
  ];
  const CHART_COLORS = [
    "#38b6ff",
    "#3ed0a6",
    "#ffc93c",
    "#79d0f9",
    "#ef4a5a",
    "#6b63d9",
    "#f2994a",
    "#2cb383",
  ];
  const NAV = [
    ["dashboard", "admindash.html", "fa-solid fa-house", "Dashboard"],
    [
      "bookings",
      "adminbookings.html",
      "fa-regular fa-calendar-check",
      "Bookings",
    ],
    ["events", "adminevent.html", "fa-regular fa-calendar-days", "Events"],
    [
      "schedule",
      "adminsched.html",
      "fa-regular fa-calendar",
      "Calendar & Scheduling",
    ],
    ["venues", "adminvenue.html", "fa-solid fa-building", "Venue Management"],
    ["guests", "adminguest.html", "fa-solid fa-users", "Participants / Guests"],
    [
      "reports",
      "adminreport.html",
      "fa-solid fa-chart-pie",
      "Reports & Reminders",
    ],
    ["settings", "adminsettings.html", "fa-solid fa-gear", "Settings"],
  ];

  const ADMIN_KEY = "ems_admin";
  const ADMIN_SEED = {
    name: "Ms. Mai",
    email: "mai@email.com",
    role: "Admin",
    photo: "images/jihyo twice icon.jpg",
  };
  const getAdmin = () => {
    try {
      return Object.assign(
        {},
        ADMIN_SEED,
        JSON.parse(localStorage.getItem(ADMIN_KEY)) || {},
      );
    } catch (e) {
      return Object.assign({}, ADMIN_SEED);
    }
  };
  const saveAdmin = (a) => {
    try {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(a));
    } catch (e) {
      console.error(e);
    }
  };

  const slug = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  const uniqueId = (base, list) => {
    let id = base || "item";
    let n = 2;
    while (list.some((x) => x.id === id)) id = (base || "item") + n++;
    return id;
  };
  const budgetMid = (s) => {
    const n = (String(s).match(/[\d,]+/g) || [])
      .map((x) => parseInt(x.replace(/,/g, ""), 10))
      .filter(Boolean);
    return n.length ? n.reduce((a, b) => a + b, 0) / n.length : 0;
  };
  const money = (n) => "\u20B1 " + Math.round(n).toLocaleString("en-US");
  const optionsOf = (arr) =>
    arr.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join("");

  function renderSidebar() {
    const el = document.querySelector(".sidebar");
    if (!el) return;
    const a = getAdmin();
    el.innerHTML = `
      <div class="sb-brand">
        <i class="fa-regular fa-calendar-check"></i>
        <div><strong>EventPro</strong><small>Admin Panel</small></div>
      </div>
      <nav class="sb-nav">
        ${NAV.map((n) => `<a href="${n[1]}"${n[0] === page ? ' class="is-active"' : ""}><i class="${n[2]}"></i> ${esc(n[3])}</a>`).join("")}
      </nav>
      <div class="sb-user">
        <span class="sb-avatar">${a.photo ? `<img src="${esc(a.photo)}" alt="">` : '<i class="fa-regular fa-user"></i>'}</span>
        <div><strong>${esc(a.name)}</strong><small>${esc(a.role)}</small></div>
        <i class="fa-solid fa-chevron-down"></i>
      </div>`;
  }

  function modal(title, body) {
    const old = document.querySelector(".am-overlay");
    if (old) old.remove();
    const wrap = document.createElement("div");
    wrap.className = "am-overlay";
    wrap.innerHTML = `
      <div class="am-box" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <div class="am-head"><h2>${esc(title)}</h2><button type="button" class="am-close" aria-label="Close">&times;</button></div>
        ${body}
      </div>`;
    document.body.appendChild(wrap);
    const close = () => wrap.remove();
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap || e.target.closest(".am-close")) close();
    });
    return { el: wrap, close };
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const o = document.querySelector(".am-overlay");
    if (o) o.remove();
  });

  function renderPager(el, current, pages) {
    let html = `<button type="button" data-p="${current - 1}"${current === 1 ? " disabled" : ""} aria-label="Previous page">&#8249;</button>`;
    for (let i = 1; i <= pages; i++) {
      html += `<button type="button" data-p="${i}"${i === current ? ' class="is-active" aria-current="page"' : ""}>${i}</button>`;
    }
    html += `<button type="button" data-p="${current + 1}"${current === pages ? " disabled" : ""} aria-label="Next page">&#8250;</button>`;
    el.innerHTML = html;
  }

  function conflict(b) {
    const v = E.getVenue(b.venueId || b.venue);
    if (v && (v.blockedDates || []).indexOf(b.date) !== -1) {
      return v.name + " is blocked on " + E.formatDate(b.date) + ".";
    }
    const other = E.getBookings().some(
      (x) =>
        x.id !== b.id &&
        x.status === "confirmed" &&
        x.date === b.date &&
        (x.venueId === b.venueId || x.venue === b.venue),
    );
    return other
      ? b.venue + " is already booked on " + E.formatDate(b.date) + "."
      : "";
  }

  function bookingForm(done) {
    const cats = E.getCategories();
    const venues = E.getVenues();
    const m = modal(
      "Add Booking",
      `<form class="am-form">
        <label>Customer Name<input name="clientName" required></label>
        <label>Email<input type="email" name="email" required></label>
        <label>Phone<input name="phone" required></label>
        <label>Event Type<select name="type" required>${cats.map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("")}</select></label>
        <label>Date<input type="date" name="date" min="${E.todayISO()}" required></label>
        <label>Venue<select name="venue" required>${venues.map((v) => `<option value="${esc(v.id)}">${esc(v.name)} (${esc(v.area)})</option>`).join("")}</select></label>
        <label>Guests<input type="number" name="guests" min="1" required></label>
        <label>Budget<select name="budget">${optionsOf(BUDGETS)}</select></label>
        <label>Status<select name="status"><option value="confirmed">Confirmed</option><option value="pending">Pending</option></select></label>
        <label class="am-wide">Details<textarea name="details" rows="3"></textarea></label>
        <p class="am-error"></p>
        <div class="am-actions">
          <button type="button" class="am-btn am-ghost am-close">Cancel</button>
          <button type="submit" class="am-btn am-primary">Save Booking</button>
        </div>
      </form>`,
    );
    const f = m.el.querySelector("form");
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      const venue = E.getVenue(d.venue);
      const cat = E.getCategory(d.type);
      const guests = parseInt(d.guests, 10);
      const err = f.querySelector(".am-error");
      if (!venue || !cat) return;
      if (d.date < E.todayISO()) {
        err.textContent = "Please choose today or a future date.";
        return;
      }
      if (!E.isDateAvailable(venue.id, d.date)) {
        err.textContent =
          venue.name + " is not available on " + E.formatDate(d.date) + ".";
        return;
      }
      if (guests > venue.capacity) {
        err.textContent =
          venue.name + " can only hold " + venue.capacity + " guests.";
        return;
      }
      E.addBooking({
        eventType: cat.name,
        eventTitle: cat.title,
        date: d.date,
        venueId: venue.id,
        venue: venue.name,
        guests: guests,
        budget: d.budget,
        details: d.details.trim() || "No special requests",
        image: cat.image,
        clientName: d.clientName.trim(),
        phone: d.phone.trim(),
        email: d.email.trim(),
        userEmail: d.email.trim(),
        status: d.status,
      });
      m.close();
      if (done) done();
    });
  }

  function viewBooking(id, done) {
    const b = E.getBooking(id);
    if (!b) return;
    const rows = [
      ["Event", b.eventTitle],
      ["Type", b.eventType],
      ["Date", E.formatDate(b.date)],
      ["Venue", b.venue],
      ["Guests", b.guests],
      ["Budget", b.budget],
      ["Customer", b.clientName],
      ["Phone", b.phone],
      ["Email", b.email],
      ["Registered Guests", (b.participants || []).length],
    ];
    const m = modal(
      "Booking " + b.id,
      `<div class="am-details">
        ${rows.map((r) => `<p><span>${esc(r[0])}</span>${esc(r[1])}</p>`).join("")}
        <p class="am-wide"><span>Details</span>${esc(b.details)}</p>
        <p class="am-wide"><span>Status</span><em class="ab-badge ${esc(b.status)}">${esc(cap(b.status))}</em></p>
      </div>
      <div class="am-form">
        <label class="am-wide">Note to customer<textarea id="amNote" rows="2">${esc(b.adminNote || "")}</textarea></label>
        <p class="am-error"></p>
        <div class="am-actions">
          <button type="button" class="am-btn am-danger" data-act="delete">Delete</button>
          ${b.status !== "pending" ? '<button type="button" class="am-btn am-ghost" data-act="pending">Mark Pending</button>' : ""}
          ${b.status !== "declined" ? '<button type="button" class="am-btn am-danger" data-act="declined">Decline</button>' : ""}
          ${b.status !== "confirmed" ? '<button type="button" class="am-btn am-ok" data-act="confirmed">Confirm</button>' : ""}
        </div>
      </div>`,
    );
    m.el.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const act = btn.getAttribute("data-act");
      const err = m.el.querySelector(".am-error");
      if (act === "delete") {
        if (!confirm("Delete booking " + b.id + "?")) return;
        E.deleteBooking(b.id);
      } else {
        if (act === "confirmed") {
          const msg = conflict(b);
          if (msg) {
            err.textContent = msg;
            return;
          }
        }
        E.setStatus(b.id, act, m.el.querySelector("#amNote").value.trim());
      }
      m.close();
      if (done) done();
    });
  }

  function initDashboard() {
    const a = getAdmin();
    const now = new Date();
    const h = now.getHours();
    $("greeting").textContent =
      "Good " +
      (h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening") +
      ", " +
      a.name +
      "!";
    $("today").textContent = E.formatDate(E.todayISO());

    const s = E.getSummary();
    $("sTotal").textContent = s.totalBookings;
    $("nTotal").textContent = "\u2191 " + s.byStatus.confirmed + " confirmed";
    $("sUpcoming").textContent = s.upcomingEvents.length;
    $("nUpcoming").textContent = s.upcomingEvents.length
      ? "\u2191 next: " + E.formatDate(s.upcomingEvents[0].date)
      : "\u2191 none scheduled";
    $("sGuests").textContent = s.totalGuests;
    $("nGuests").textContent = "\u2191 " + s.namedParticipants + " registered";
    $("sPending").textContent = s.byStatus.pending;

    const recent = E.getBookings()
      .slice()
      .sort((x, y) => String(y.createdAt).localeCompare(String(x.createdAt)))
      .slice(0, 5);
    $("bookingRows").innerHTML = recent.length
      ? recent
          .map(
            (b) => `<tr>
              <td>${esc(b.id)}</td><td>${esc(b.clientName)}</td><td>${esc(b.eventType)}</td>
              <td>${esc(E.formatDate(b.date))}</td>
              <td><span class="pill pill-${esc(b.status)}">${esc(cap(b.status))}</span></td>
              <td><a class="btn-view" href="adminbookings.html?id=${encodeURIComponent(b.id)}">View</a></td>
            </tr>`,
          )
          .join("")
      : '<tr><td colspan="6" class="empty">No bookings yet.</td></tr>';

    const view = { y: now.getFullYear(), m: now.getMonth() };
    const draw = () => {
      $("calTitle").textContent = MONTHS[view.m] + " " + view.y;
      const marked = {};
      E.getBookings().forEach((b) => {
        if (b.status !== "declined") marked[b.date] = true;
      });
      let html = DAYS.map((d) => `<span class="dow">${d}</span>`).join("");
      const first = new Date(view.y, view.m, 1).getDay();
      const total = new Date(view.y, view.m + 1, 0).getDate();
      for (let i = 0; i < first; i++) html += "<span></span>";
      for (let d = 1; d <= total; d++) {
        const key = view.y + "-" + pad(view.m + 1) + "-" + pad(d);
        const isToday = key === E.todayISO();
        html += `<span class="cal-day${marked[key] ? " has-event" : ""}${isToday ? " is-today" : ""}">${d}</span>`;
      }
      $("calGrid").innerHTML = html;
    };
    $("prevM").addEventListener("click", () => {
      view.m--;
      if (view.m < 0) {
        view.m = 11;
        view.y--;
      }
      draw();
    });
    $("nextM").addEventListener("click", () => {
      view.m++;
      if (view.m > 11) {
        view.m = 0;
        view.y++;
      }
      draw();
    });
    draw();
  }

  function initBookings() {
    const PER = 6;
    let pg = 1;
    const rows = $("abRows");
    const pager = $("abPager");
    E.getCategories().forEach((c) =>
      $("abType").add(new Option(c.name, c.name)),
    );
    if (params.get("status")) $("abStatus").value = params.get("status");

    const list = () => {
      const q = $("abSearch").value.trim().toLowerCase();
      const st = $("abStatus").value;
      const ty = $("abType").value;
      const from = $("abStart").value;
      const to = $("abEnd").value;
      return E.getBookings()
        .filter((b) => {
          if (st && b.status !== st) return false;
          if (ty && b.eventType !== ty) return false;
          if (from && b.date < from) return false;
          if (to && b.date > to) return false;
          if (
            q &&
            (b.id + " " + b.clientName + " " + b.eventType + " " + b.eventTitle)
              .toLowerCase()
              .indexOf(q) < 0
          )
            return false;
          return true;
        })
        .sort((x, y) => x.date.localeCompare(y.date));
    };

    const render = () => {
      const all = list();
      const pages = Math.max(1, Math.ceil(all.length / PER));
      if (pg > pages) pg = pages;
      const slice = all.slice((pg - 1) * PER, pg * PER);
      rows.innerHTML = slice.length
        ? slice
            .map(
              (b) => `<tr>
                <td>${esc(b.id)}</td><td>${esc(b.clientName)}</td><td>${esc(b.eventType)}</td>
                <td>${esc(E.formatDate(b.date))}</td><td>${esc(b.guests)}</td>
                <td><span class="ab-badge ${esc(b.status)}">${esc(cap(b.status))}</span></td>
                <td><a href="#" class="ab-view" data-id="${esc(b.id)}">View</a></td>
              </tr>`,
            )
            .join("")
        : '<tr><td colspan="7" class="ab-empty">No bookings found.</td></tr>';
      renderPager(pager, pg, pages);
    };

    pager.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-p]");
      if (!b || b.disabled) return;
      pg = +b.getAttribute("data-p");
      render();
    });
    rows.addEventListener("click", (e) => {
      const a = e.target.closest("[data-id]");
      if (!a) return;
      e.preventDefault();
      viewBooking(a.getAttribute("data-id"), render);
    });
    $("addBookingBtn").addEventListener("click", (e) => {
      e.preventDefault();
      bookingForm(render);
    });
    ["abSearch", "abStatus", "abType", "abStart", "abEnd"].forEach((id) => {
      $(id).addEventListener(id === "abSearch" ? "input" : "change", () => {
        pg = 1;
        render();
      });
    });
    render();
    if (params.get("id")) viewBooking(params.get("id"), render);
  }

  function initEvents() {
    const rows = $("eventRows");
    E.getCategories().forEach((c) =>
      $("categoryFilter").add(new Option(c.name, c.name)),
    );

    const render = () => {
      const q = $("eventSearch").value.trim().toLowerCase();
      const cat = $("categoryFilter").value;
      const st = $("statusFilter").value;
      const list = E.getBookings()
        .filter((b) => {
          if (b.status === "declined") return false;
          if (cat && b.eventType !== cat) return false;
          if (st && b.status !== st) return false;
          if (
            q &&
            (
              b.eventTitle +
              " " +
              b.eventType +
              " " +
              b.venue +
              " " +
              b.clientName
            )
              .toLowerCase()
              .indexOf(q) < 0
          )
            return false;
          return true;
        })
        .sort((x, y) => x.date.localeCompare(y.date));
      rows.innerHTML = list.length
        ? list
            .map(
              (b) => `<tr>
                <td><img class="ae-thumb" src="${esc(b.image || "images/event.jpg")}" alt=""></td>
                <td>${esc(b.eventTitle)}</td><td>${esc(b.eventType)}</td>
                <td>${esc(E.formatDate(b.date))}</td><td>${esc(b.venue)}</td>
                <td><span class="ae-badge ${esc(b.status)}">${esc(cap(b.status))}</span></td>
                <td><a href="#" class="ae-view" data-id="${esc(b.id)}">View</a></td>
              </tr>`,
            )
            .join("")
        : '<tr><td colspan="7" class="ag-empty">No events found.</td></tr>';
    };

    rows.addEventListener("click", (e) => {
      const a = e.target.closest("[data-id]");
      if (!a) return;
      e.preventDefault();
      viewBooking(a.getAttribute("data-id"), render);
    });
    $("addEventBtn").addEventListener("click", (e) => {
      e.preventDefault();
      bookingForm(render);
    });
    ["eventSearch", "categoryFilter", "statusFilter"].forEach((id) => {
      $(id).addEventListener(id === "eventSearch" ? "input" : "change", render);
    });
    render();
  }

  function initSchedule() {
    const sel = $("schedVenue");
    const grid = $("calGrid");
    const hint = $("schedHint");
    E.getVenues().forEach((v) => sel.add(new Option(v.name, v.id)));
    const now = new Date();
    let y = now.getFullYear();
    let m = now.getMonth();

    const drawUpcoming = () => {
      const today = E.todayISO();
      const list = E.getBookings()
        .filter((b) => b.status !== "declined" && b.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 6);
      $("upcomingList").innerHTML = list.length
        ? list
            .map(
              (
                b,
              ) => `<div class="as-event" style="--dot:${b.status === "confirmed" ? "#2fb68b" : "#f2b315"}">
                <div>
                  <h3>${esc(b.eventTitle)}</h3>
                  <p>${esc(E.formatDate(b.date))} &bull; ${esc(b.venue)}</p>
                  <p>${esc(b.guests)} guests &bull; ${esc(cap(b.status))}</p>
                </div>
                <a href="adminbookings.html?id=${encodeURIComponent(b.id)}" class="as-view">View</a>
              </div>`,
            )
            .join("")
        : "<p>No upcoming events.</p>";
    };

    const draw = () => {
      $("calTitle").textContent = MONTHS[m] + " " + y;
      grid.innerHTML = DAYS.map((d) => `<div class="as-dow">${d}</div>`).join(
        "",
      );
      const v = E.getVenue(sel.value);
      const unavailable = new Set(v ? E.getUnavailableDates(v.id) : []);
      const blocked = new Set(v ? v.blockedDates || [] : []);
      const today = E.todayISO();
      const first = new Date(y, m, 1).getDay();
      const total = new Date(y, m + 1, 0).getDate();
      let html = "";
      for (let i = 0; i < first; i++) html += "<div></div>";
      for (let d = 1; d <= total; d++) {
        const k = y + "-" + pad(m + 1) + "-" + pad(d);
        let cls = "as-day";
        let title = "";
        if (unavailable.has(k)) {
          cls += " is-booked";
          title = blocked.has(k)
            ? "Blocked - click to open this date"
            : "Booked";
        } else if (k >= today) {
          cls += " is-available";
          title = "Available - click to block this date";
        }
        if (k === today) cls += " is-today";
        if (k >= today && v) cls += " is-clickable";
        html += `<div class="${cls}"${title ? ` title="${esc(title)}"` : ""}${k >= today && v ? ` data-date="${k}"` : ""}>${d}</div>`;
      }
      grid.insertAdjacentHTML("beforeend", html);
    };

    grid.addEventListener("click", (e) => {
      const el = e.target.closest("[data-date]");
      if (!el) return;
      const k = el.getAttribute("data-date");
      const venues = E.getVenues();
      const i = venues.findIndex((v) => v.id === sel.value);
      if (i < 0) return;
      const v = venues[i];
      const blocked = v.blockedDates || [];
      if (blocked.indexOf(k) !== -1) {
        v.blockedDates = blocked.filter((x) => x !== k);
        hint.textContent =
          E.formatDate(k) + " is open again for " + v.name + ".";
      } else if (E.getUnavailableDates(v.id).indexOf(k) !== -1) {
        hint.textContent =
          E.formatDate(k) +
          " already has a confirmed booking at " +
          v.name +
          ".";
        return;
      } else {
        v.blockedDates = blocked.concat([k]);
        hint.textContent =
          E.formatDate(k) + " is now blocked for " + v.name + ".";
      }
      E.saveVenues(venues);
      draw();
    });
    sel.addEventListener("change", () => {
      hint.textContent = "";
      draw();
    });
    $("prevMonth").addEventListener("click", () => {
      m--;
      if (m < 0) {
        m = 11;
        y--;
      }
      draw();
    });
    $("nextMonth").addEventListener("click", () => {
      m++;
      if (m > 11) {
        m = 0;
        y++;
      }
      draw();
    });
    draw();
    drawUpcoming();
  }

  function venueForm(id, done) {
    const v = id ? E.getVenue(id) : null;
    const m = modal(
      v ? "Edit Venue" : "Add Venue",
      `<form class="am-form">
        <label>Venue Name<input name="name" value="${esc(v ? v.name : "")}" required></label>
        <label>Location<input name="area" value="${esc(v ? v.area : "")}" placeholder="e.g. Makati Area" required></label>
        <label>Capacity<input type="number" name="capacity" min="1" value="${esc(v ? v.capacity : "")}" required></label>
        <label>Price Range (PHP)<input name="price" value="${esc(v ? v.price : "")}" placeholder="80,000-120,000" required></label>
        <label>Type<input name="type" value="${esc(v ? v.type : "")}" placeholder="Indoor, Outdoor..." required></label>
        <label>Image Path<input name="image" value="${esc(v ? v.image : "images/event.jpg")}"></label>
        <label class="am-check"><input type="checkbox" name="active"${!v || v.active !== false ? " checked" : ""}> Active</label>
        <p class="am-error"></p>
        <div class="am-actions">
          ${v ? '<button type="button" class="am-btn am-danger" data-del>Delete</button>' : ""}
          <button type="button" class="am-btn am-ghost am-close">Cancel</button>
          <button type="submit" class="am-btn am-primary">Save Venue</button>
        </div>
      </form>`,
    );
    const f = m.el.querySelector("form");
    const err = f.querySelector(".am-error");
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      const data = {
        name: d.name.trim(),
        area: d.area.trim(),
        capacity: parseInt(d.capacity, 10),
        price: d.price.trim(),
        type: d.type.trim(),
        image: d.image.trim() || "images/event.jpg",
        active: f.querySelector('[name="active"]').checked,
      };
      const list = E.getVenues();
      if (
        list.some(
          (x) =>
            x.name.toLowerCase() === data.name.toLowerCase() &&
            (!v || x.id !== v.id),
        )
      ) {
        err.textContent = "A venue with that name already exists.";
        return;
      }
      if (v) {
        const i = list.findIndex((x) => x.id === v.id);
        list[i] = Object.assign({}, v, data);
        if (v.name !== data.name) {
          E.saveBookings(
            E.getBookings().map((b) =>
              b.venueId === v.id
                ? Object.assign({}, b, { venue: data.name })
                : b,
            ),
          );
        }
      } else {
        list.push(
          Object.assign(
            { id: uniqueId(slug(data.name), list), blockedDates: [] },
            data,
          ),
        );
      }
      E.saveVenues(list);
      m.close();
      if (done) done();
    });
    const del = f.querySelector("[data-del]");
    if (del) {
      del.addEventListener("click", () => {
        if (
          E.getBookings().some((b) => b.venueId === v.id || b.venue === v.name)
        ) {
          err.textContent =
            "This venue has bookings, so it can't be deleted. Set it to inactive instead.";
          return;
        }
        if (!confirm("Delete " + v.name + "?")) return;
        E.saveVenues(E.getVenues().filter((x) => x.id !== v.id));
        m.close();
        if (done) done();
      });
    }
  }

  function initVenues() {
    const rows = $("venueRows");
    const loc = $("locationFilter");

    const fillLocations = () => {
      const cur = loc.value;
      const areas = Array.from(
        new Set(E.getVenues().map((v) => v.area)),
      ).sort();
      loc.innerHTML =
        '<option value="">All Locations</option>' +
        areas.map((a) => `<option>${esc(a)}</option>`).join("");
      loc.value = areas.indexOf(cur) === -1 ? "" : cur;
    };

    const render = () => {
      const q = $("venueSearch").value.trim().toLowerCase();
      const st = $("statusFilter").value;
      const today = E.todayISO();
      const list = E.getVenues().filter((v) => {
        const active = v.active !== false;
        if (st === "active" && !active) return false;
        if (st === "inactive" && active) return false;
        if (loc.value && v.area !== loc.value) return false;
        if (
          q &&
          (v.name + " " + v.area + " " + v.type).toLowerCase().indexOf(q) < 0
        )
          return false;
        return true;
      });
      rows.innerHTML = list.length
        ? list
            .map((v) => {
              const active = v.active !== false;
              const booked = E.getUnavailableDates(v.id).indexOf(today) !== -1;
              return `<tr>
                <td><img class="av-thumb" src="${esc(v.image || "images/event.jpg")}" alt=""></td>
                <td>${esc(v.name)}</td><td>${esc(v.area)}</td><td>${esc(v.capacity)}</td>
                <td><span class="av-badge ${booked ? "booked" : "available"}">${booked ? "Booked" : "Available"}</span></td>
                <td><span class="av-badge ${active ? "active" : "inactive"}">${active ? "Active" : "Inactive"}</span></td>
                <td><a href="#" class="av-view" data-id="${esc(v.id)}">View</a></td>
              </tr>`;
            })
            .join("")
        : '<tr><td colspan="7" class="ag-empty">No venues found.</td></tr>';
    };

    const refresh = () => {
      fillLocations();
      render();
    };
    rows.addEventListener("click", (e) => {
      const a = e.target.closest("[data-id]");
      if (!a) return;
      e.preventDefault();
      venueForm(a.getAttribute("data-id"), refresh);
    });
    $("addVenueBtn").addEventListener("click", (e) => {
      e.preventDefault();
      venueForm(null, refresh);
    });
    ["venueSearch", "statusFilter", "locationFilter"].forEach((id) => {
      $(id).addEventListener(id === "venueSearch" ? "input" : "change", render);
    });
    refresh();
  }

  function guestForm(done) {
    const bookings = E.getBookings().filter((b) => b.status !== "declined");
    if (!bookings.length) {
      alert("There are no bookings to add guests to yet.");
      return;
    }
    const m = modal(
      "Add Guest",
      `<form class="am-form">
        <label class="am-wide">Booking<select name="booking" required>${bookings
          .map(
            (b) =>
              `<option value="${esc(b.id)}">${esc(b.id)} - ${esc(b.eventTitle)} (${esc(E.formatDate(b.date))})</option>`,
          )
          .join("")}</select></label>
        <label>Guest Name<input name="name" required></label>
        <label>Email<input type="email" name="email"></label>
        <label>RSVP<select name="rsvp"><option value="yes">Yes</option><option value="pending">Pending</option><option value="no">No</option></select></label>
        <p class="am-error"></p>
        <div class="am-actions">
          <button type="button" class="am-btn am-ghost am-close">Cancel</button>
          <button type="submit" class="am-btn am-primary">Add Guest</button>
        </div>
      </form>`,
    );
    const f = m.el.querySelector("form");
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      const b = E.getBooking(d.booking);
      if (!b) return;
      if ((b.participants || []).length >= Number(b.guests)) {
        f.querySelector(".am-error").textContent =
          "This booking is limited to " + b.guests + " guests.";
        return;
      }
      E.addParticipant(b.id, {
        name: d.name.trim(),
        email: d.email.trim(),
        rsvp: d.rsvp,
      });
      m.close();
      if (done) done();
    });
  }

  function initGuests() {
    const rows = $("guestRows");

    const render = () => {
      const s = E.getSummary();
      $("guestBookingCount").textContent = s.totalBookings;
      $("guestTotalCount").textContent = s.confirmedGuests;
      $("guestRegisteredCount").textContent = s.namedParticipants;
      $("guestPendingCount").textContent = s.byStatus.pending;

      const q = $("guestSearch").value.trim().toLowerCase();
      const st = $("guestStatusFilter").value;
      const rsvp = $("rsvpFilter").value;
      const all = E.getParticipants().map((p) => {
        const b = E.getBooking(p.bookingId) || {};
        return Object.assign({}, p, {
          status: b.status || "pending",
          rsvp: p.rsvp || "pending",
        });
      });
      const list = all.filter((p) => {
        if (st && p.status !== st) return false;
        if (rsvp && p.rsvp !== rsvp) return false;
        if (
          q &&
          (p.name + " " + p.email + " " + p.eventTitle)
            .toLowerCase()
            .indexOf(q) < 0
        )
          return false;
        return true;
      });
      rows.innerHTML = list.length
        ? list
            .map(
              (p) => `<tr>
                <td>${esc(p.name)}</td><td>${esc(p.email || "N/A")}</td><td>${esc(p.eventTitle)}</td>
                <td>${esc(E.formatDate(p.date))}</td>
                <td><span class="ag-badge ${p.status === "confirmed" ? "registered" : esc(p.status)}">${esc(cap(p.status))}</span></td>
                <td><span class="ag-rsvp ${esc(p.rsvp)}">${esc(cap(p.rsvp))}</span></td>
                <td><a href="#" class="ag-view danger" data-b="${esc(p.bookingId)}" data-i="${p.index}">Remove</a></td>
              </tr>`,
            )
            .join("")
        : '<tr><td colspan="7" class="ag-empty">No guests found. Use Add Guest to register one.</td></tr>';
      $("guestResultCount").textContent =
        "Showing " + list.length + " of " + all.length + " registered guests";

      const events = E.getBookings()
        .filter((b) => b.status !== "declined")
        .sort((a, b) => a.date.localeCompare(b.date));
      $("guestSummaryRows").innerHTML = events.length
        ? events
            .map((b) => {
              const reg = (b.participants || []).length;
              const left = Math.max(0, Number(b.guests) - reg);
              return `<tr>
                <td>${esc(b.eventTitle)}</td><td>${esc(b.clientName)}</td><td>${esc(E.formatDate(b.date))}</td>
                <td>${esc(b.guests)}</td><td>${reg}</td><td>${left}</td>
              </tr>`;
            })
            .join("")
        : '<tr><td colspan="6" class="ag-empty">No events yet.</td></tr>';
    };

    rows.addEventListener("click", (e) => {
      const a = e.target.closest("[data-b]");
      if (!a) return;
      e.preventDefault();
      if (!confirm("Remove this guest?")) return;
      E.removeParticipant(
        a.getAttribute("data-b"),
        parseInt(a.getAttribute("data-i"), 10),
      );
      render();
    });
    $("addGuestBtn").addEventListener("click", () => guestForm(render));
    ["guestSearch", "guestStatusFilter", "rsvpFilter"].forEach((id) => {
      $(id).addEventListener(id === "guestSearch" ? "input" : "change", render);
    });
    render();
  }

  function initReports() {
    const bookings = E.getBookings();
    const s = E.getSummary();
    const active = bookings.filter((b) => b.status !== "declined");
    const confirmed = bookings.filter((b) => b.status === "confirmed");

    $("rEvents").textContent = confirmed.length;
    $("rEventsNote").textContent = s.byStatus.pending + " pending";
    $("rGuests").textContent = s.confirmedGuests;
    $("rGuestsNote").textContent = s.namedParticipants + " registered";
    $("rRevenue").textContent = money(
      confirmed.reduce((sum, b) => sum + budgetMid(b.budget), 0),
    );
    $("rPending").textContent = s.byStatus.pending;

    const counts = {};
    active.forEach((b) => {
      counts[b.eventType] = (counts[b.eventType] || 0) + 1;
    });
    const names = Object.keys(counts);
    const total = active.length || 1;
    $("rLegend").innerHTML = names.length
      ? names
          .map(
            (n, i) => `<li>
              <span class="ar-legend-dot" style="background-color:${CHART_COLORS[i % CHART_COLORS.length]}"></span>
              <span class="ar-legend-label">${esc(n)}</span>
              <span class="ar-legend-val">${Math.round((counts[n] / total) * 100)}%</span>
            </li>`,
          )
          .join("")
      : '<li class="ar-legend-label">No data yet.</li>';

    if (window.Chart && names.length) {
      new Chart($("categoryChart").getContext("2d"), {
        type: "doughnut",
        data: {
          labels: names,
          datasets: [
            {
              data: names.map((n) => counts[n]),
              backgroundColor: names.map(
                (n, i) => CHART_COLORS[i % CHART_COLORS.length],
              ),
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          cutout: "72%",
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
        },
      });
    }

    const today = E.todayISO();
    const items = [];
    bookings
      .filter((b) => b.status === "pending")
      .forEach((b) => items.push({ b: b, action: "Respond to request" }));
    bookings
      .filter((b) => b.status === "confirmed" && b.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((b) =>
        items.push({
          b: b,
          action:
            (b.participants || []).length < Number(b.guests)
              ? "Confirm guest list"
              : "Send reminders",
        }),
      );
    $("rReminders").innerHTML = items.length
      ? items
          .slice(0, 6)
          .map(
            (i) => `<li>
              <span class="ar-rem-dot"></span>
              <div class="ar-rem-content">
                <strong>${esc(i.b.venue)}</strong>
                <span class="ar-rem-date">${esc(E.formatDate(i.b.date))}</span>
                <a class="ar-rem-action" href="adminbookings.html?id=${encodeURIComponent(i.b.id)}">${esc(i.action)}</a>
              </div>
            </li>`,
          )
          .join("")
      : '<li class="ar-rem-action">No reminders right now.</li>';
  }

  function initSettings() {
    const box = $("asetContent");
    const tabs = document.querySelectorAll("[data-tab]");
    let tab = "account";

    function viewAccount() {
      const a = getAdmin();
      box.innerHTML = `
        <h2>Account Information</h2>
        <div class="aset-form-wrapper">
          <form class="aset-form" id="asetForm">
            <div class="aset-field"><label for="fullName">Name</label><input type="text" id="fullName" value="${esc(a.name)}" required></div>
            <div class="aset-field"><label for="emailAddr">Email</label><input type="email" id="emailAddr" value="${esc(a.email)}" required></div>
            <div class="aset-field"><label for="userRole">Role</label><input type="text" id="userRole" value="${esc(a.role)}" required></div>
            <p class="aset-msg" id="asetMsg"></p>
            <div class="aset-actions"><button type="submit" class="aset-btn-save">Save Changes</button></div>
          </form>
          <div class="aset-photo-sec">
            <div class="aset-photo-preview">${a.photo ? `<img src="${esc(a.photo)}" alt="">` : '<i class="fa-regular fa-user"></i>'}</div>
            <input type="file" id="asetPhotoInput" accept="image/*" hidden>
            <button type="button" class="aset-btn-photo" id="asetPhotoBtn">Change Photo</button>
          </div>
        </div>`;
      $("asetForm").addEventListener("submit", (e) => {
        e.preventDefault();
        saveAdmin(
          Object.assign(getAdmin(), {
            name: $("fullName").value.trim(),
            email: $("emailAddr").value.trim(),
            role: $("userRole").value.trim(),
          }),
        );
        renderSidebar();
        $("asetMsg").textContent = "Changes saved.";
      });
      $("asetPhotoBtn").addEventListener("click", () =>
        $("asetPhotoInput").click(),
      );
      $("asetPhotoInput").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 500000) {
          $("asetMsg").textContent = "Please choose an image under 500 KB.";
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          saveAdmin(Object.assign(getAdmin(), { photo: reader.result }));
          renderSidebar();
          viewAccount();
        };
        reader.readAsDataURL(file);
      });
    }

    function viewCategories() {
      const cats = E.getCategories();
      const bookings = E.getBookings();
      box.innerHTML = `
        <h2>Event Categories</h2>
        <div class="ag-table-wrap">
          <table class="ag-table">
            <thead><tr><th>Name</th><th>Event Title</th><th>Tagline</th><th>Bookings</th><th>Action</th></tr></thead>
            <tbody>${cats
              .map(
                (c) => `<tr>
                  <td>${esc(c.name)}</td><td>${esc(c.title)}</td><td>${esc(c.tagline)}</td>
                  <td>${bookings.filter((b) => b.eventType === c.name).length}</td>
                  <td><a href="#" class="ag-view danger" data-cat="${esc(c.id)}">Remove</a></td>
                </tr>`,
              )
              .join("")}</tbody>
          </table>
        </div>
        <h2 class="ag-subhead">Add Category</h2>
        <form class="am-form" id="catForm">
          <label>Name<input name="name" required></label>
          <label>Event Title<input name="title" placeholder="Defaults to the name"></label>
          <label>Tagline<input name="tagline" required></label>
          <label>Color<select name="color">${COLORS.map((c) => `<option value="${c[0]}">${c[1]}</option>`).join("")}</select></label>
          <p class="am-error"></p>
          <div class="am-actions"><button type="submit" class="am-btn am-primary">Add Category</button></div>
        </form>`;
      box.querySelector("tbody").addEventListener("click", (e) => {
        const a = e.target.closest("[data-cat]");
        if (!a) return;
        e.preventDefault();
        const c = E.getCategory(a.getAttribute("data-cat"));
        if (!c) return;
        if (E.getBookings().some((b) => b.eventType === c.name)) {
          alert(
            "This category is used by existing bookings, so it can't be removed.",
          );
          return;
        }
        if (!confirm("Remove " + c.name + "?")) return;
        E.saveCategories(E.getCategories().filter((x) => x.id !== c.id));
        viewCategories();
      });
      $("catForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = e.target;
        const d = Object.fromEntries(new FormData(f));
        const list = E.getCategories();
        const name = d.name.trim();
        if (list.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
          f.querySelector(".am-error").textContent =
            "That category already exists.";
          return;
        }
        list.push({
          id: uniqueId(slug(name), list),
          name: name,
          title: d.title.trim() || name,
          icon: "fa-solid fa-star",
          color: d.color,
          tagline: d.tagline.trim(),
          image: "images/event.jpg",
        });
        E.saveCategories(list);
        viewCategories();
      });
    }

    function viewSystem() {
      const s = E.getSummary();
      box.innerHTML = `
        <h2>System</h2>
        <div class="am-details">
          <p><span>Bookings</span>${s.totalBookings}</p>
          <p><span>Venues</span>${s.totalVenues}</p>
          <p><span>Event Categories</span>${s.totalCategories}</p>
          <p><span>Registered Guests</span>${s.namedParticipants}</p>
        </div>
        <p class="aset-msg is-error" id="asetMsg"></p>
        <button type="button" class="am-btn am-danger" id="resetBtn">Reset Demo Data</button>`;
      $("resetBtn").addEventListener("click", () => {
        if (
          !confirm(
            "This restores the sample bookings, venues and categories. Continue?",
          )
        )
          return;
        Object.keys(E.KEYS).forEach((k) => localStorage.removeItem(E.KEYS[k]));
        location.reload();
      });
    }

    const views = {
      account: viewAccount,
      categories: viewCategories,
      system: viewSystem,
    };
    const show = () => {
      tabs.forEach((t) =>
        t.classList.toggle("is-active", t.getAttribute("data-tab") === tab),
      );
      views[tab]();
    };
    tabs.forEach((t) =>
      t.addEventListener("click", (e) => {
        e.preventDefault();
        tab = t.getAttribute("data-tab");
        show();
      }),
    );
    show();
  }

  renderSidebar();
  const inits = {
    dashboard: initDashboard,
    bookings: initBookings,
    events: initEvents,
    schedule: initSchedule,
    venues: initVenues,
    guests: initGuests,
    reports: initReports,
    settings: initSettings,
  };
  if (inits[page]) inits[page]();
})();
