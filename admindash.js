(function () {
  var E = window.EMS;
  if (!E) return;

  var MONTHS = [
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
  var pad = function (n) {
    return String(n).padStart(2, "0");
  };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  };
  var fmt = function (d) {
    var p = d.split("-");
    return MONTHS[+p[1] - 1].slice(0, 3) + " " + +p[2] + ", " + p[0];
  };
  var $ = function (id) {
    return document.getElementById(id);
  };

  var now = new Date();
  var h = now.getHours();
  $("greeting").textContent =
    "Good " +
    (h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening") +
    ", Ms. Mai!";
  $("today").textContent =
    MONTHS[now.getMonth()].slice(0, 3) +
    " " +
    now.getDate() +
    ", " +
    now.getFullYear();

  var s = E.summary();
  $("sTotal").textContent = s.totalEvents;
  $("nTotal").textContent = "↑ " + s.byStatus.confirmed + " confirmed";
  $("sUpcoming").textContent = s.upcoming.length;
  $("nUpcoming").textContent = s.upcoming.length
    ? "↑ next: " + fmt(s.upcoming[0].date)
    : "↑ none scheduled";
  $("sGuests").textContent = s.expectedGuests;
  $("nGuests").textContent = "↑ " + s.totalParticipants + " registered";
  $("sPending").textContent = s.byStatus.pending;

  var rows = E.events()
    .slice()
    .sort(function (a, b) {
      return b.date.localeCompare(a.date);
    })
    .slice(0, 5);
  $("bookingRows").innerHTML = rows.length
    ? rows
        .map(function (e) {
          var cat = E.getCategory(e.categoryId) || {};
          var label = e.status.charAt(0).toUpperCase() + e.status.slice(1);
          return (
            "<tr><td>" +
            esc(e.id) +
            "</td><td>" +
            esc(e.contact.name) +
            "</td><td>" +
            esc(cat.single || cat.name) +
            "</td><td>" +
            fmt(e.date) +
            '</td><td><span class="pill pill-' +
            esc(e.status) +
            '">' +
            label +
            "</span></td>" +
            '<td><a class="btn-view" href="bookingdetails.html?id=' +
            encodeURIComponent(e.id) +
            '&admin=1">View</a></td></tr>'
          );
        })
        .join("")
    : '<tr><td colspan="6" class="empty">No bookings yet.</td></tr>';

  var view = { y: now.getFullYear(), m: now.getMonth() };
  function drawCal() {
    $("calTitle").textContent = MONTHS[view.m] + " " + view.y;
    var marked = {};
    E.events().forEach(function (e) {
      if (e.status !== "declined") marked[e.date] = true;
    });
    var html = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      .map(function (d) {
        return '<span class="dow">' + d + "</span>";
      })
      .join("");
    var first = new Date(view.y, view.m, 1).getDay();
    var total = new Date(view.y, view.m + 1, 0).getDate();
    for (var i = 0; i < first; i++) html += "<span></span>";
    for (var d = 1; d <= total; d++) {
      var key = view.y + "-" + pad(view.m + 1) + "-" + pad(d);
      var cls =
        "cal-day" +
        (marked[key] ? " has-event" : "") +
        (d === now.getDate() &&
        view.m === now.getMonth() &&
        view.y === now.getFullYear()
          ? " is-today"
          : "");
      html += '<span class="' + cls + '">' + d + "</span>";
    }
    $("calGrid").innerHTML = html;
  }
  $("prevM").addEventListener("click", function () {
    view.m--;
    if (view.m < 0) {
      view.m = 11;
      view.y--;
    }
    drawCal();
  });
  $("nextM").addEventListener("click", function () {
    view.m++;
    if (view.m > 11) {
      view.m = 0;
      view.y++;
    }
    drawCal();
  });
  drawCal();
})();
