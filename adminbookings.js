(function () {
  "use strict";

  var PER_PAGE = 6;
  var SHOW_SAMPLE = true; 

  var SAMPLE = [
    ["BK-0012", "Maria Santos", "Birthday", "2026-10-10", 50, "confirmed"],
    ["BK-0011", "Juan Dela Cruz", "Wedding", "2026-10-15", 120, "pending"],
    ["BK-0010", "Ana Reyes", "Corporate", "2026-10-18", 80, "confirmed"],
    ["BK-0009", "Carlos Lim", "Debut", "2026-10-22", 100, "pending"],
    ["BK-0008", "Lisa Garcia", "Anniversary", "2026-10-28", 60, "confirmed"],
    ["BK-0007", "Ramon Torres", "Seminar", "2026-11-05", 70, "declined"],
    ["BK-0006", "Grace Tan", "Birthday", "2026-11-08", 40, "confirmed"],
    ["BK-0005", "Paolo Cruz", "Wedding", "2026-11-12", 150, "pending"],
    [
      "BK-0004",
      "Liza Mercado",
      "Product Launch",
      "2026-11-20",
      90,
      "confirmed",
    ],
    ["BK-0003", "Jon Dela Cruz", "Corporate", "2026-11-25", 110, "declined"],
    ["BK-0002", "Kate Villanueva", "Debut", "2026-12-02", 130, "confirmed"],
    ["BK-0001", "Marco Lim", "Anniversary", "2026-12-06", 45, "pending"],
  ].map(function (r) {
    return {
      id: r[0],
      name: r[1],
      type: r[2],
      date: r[3],
      guests: r[4],
      status: r[5],
      link: "bookingdetails.html",
    };
  });

  function realBookings() {
    if (!window.EMS) return [];
    return EMS.events().map(function (e) {
      var cat = EMS.getCategory(e.categoryId) || {};
      return {
        id: "BK-" + String(e.id).replace(/\D/g, ""),
        name: (e.contact && e.contact.name) || "-",
        type: cat.single || cat.name || e.title,
        date: e.date,
        guests: e.guests,
        status: e.status,
        link: "bookingdetails.html?admin=1&id=" + encodeURIComponent(e.id),
      };
    });
  }

  var ALL = realBookings()
    .concat(SHOW_SAMPLE ? SAMPLE : [])
    .sort(function (a, b) {
      return a.date.localeCompare(b.date);
    });

  var MONTHS = [
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
  function fmtDate(s) {
    var p = s.split("-");
    return MONTHS[+p[1] - 1] + " " + +p[2] + ", " + p[0];
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }
  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  var $ = function (id) {
    return document.getElementById(id);
  };
  var rowsEl = $("abRows"),
    pagerEl = $("abPager");
  var page = 1;

  var types = [];
  ALL.forEach(function (b) {
    if (types.indexOf(b.type) < 0) types.push(b.type);
  });
  types.sort().forEach(function (t) {
    var o = document.createElement("option");
    o.value = t;
    o.textContent = t;
    $("abType").appendChild(o);
  });

  function filtered() {
    var q = $("abSearch").value.trim().toLowerCase();
    var st = $("abStatus").value,
      ty = $("abType").value;
    var from = $("abStart").value,
      to = $("abEnd").value;
    return ALL.filter(function (b) {
      if (st && b.status !== st) return false;
      if (ty && b.type !== ty) return false;
      if (from && b.date < from) return false;
      if (to && b.date > to) return false;
      if (
        q &&
        (b.id + " " + b.name + " " + b.type).toLowerCase().indexOf(q) < 0
      )
        return false;
      return true;
    });
  }

  function render() {
    var list = filtered();
    var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (page > pages) page = pages;
    var slice = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    rowsEl.innerHTML = slice.length
      ? slice
          .map(function (b) {
            return (
              "<tr>" +
              "<td>" +
              esc(b.id) +
              "</td>" +
              "<td>" +
              esc(b.name) +
              "</td>" +
              "<td>" +
              esc(b.type) +
              "</td>" +
              "<td>" +
              fmtDate(b.date) +
              "</td>" +
              "<td>" +
              esc(b.guests) +
              "</td>" +
              '<td><span class="ab-badge ' +
              esc(b.status) +
              '">' +
              cap(esc(b.status)) +
              "</span></td>" +
              '<td><a class="ab-view" href="' +
              esc(b.link) +
              '">View</a></td>' +
              "</tr>"
            );
          })
          .join("")
      : '<tr><td colspan="7" class="ab-empty">No bookings found.</td></tr>';

    var html =
      '<button type="button" data-p="' +
      (page - 1) +
      '"' +
      (page === 1 ? " disabled" : "") +
      ' aria-label="Previous page">&#8249;</button>';
    for (var i = 1; i <= pages; i++) {
      html +=
        '<button type="button" data-p="' +
        i +
        '"' +
        (i === page ? ' class="is-active" aria-current="page"' : "") +
        ">" +
        i +
        "</button>";
    }
    html +=
      '<button type="button" data-p="' +
      (page + 1) +
      '"' +
      (page === pages ? " disabled" : "") +
      ' aria-label="Next page">&#8250;</button>';
    pagerEl.innerHTML = html;
  }

  pagerEl.addEventListener("click", function (ev) {
    var b = ev.target.closest("button[data-p]");
    if (!b || b.disabled) return;
    page = +b.getAttribute("data-p");
    render();
  });

  ["abSearch", "abStatus", "abType", "abStart", "abEnd"].forEach(function (id) {
    $(id).addEventListener(id === "abSearch" ? "input" : "change", function () {
      page = 1;
      render();
    });
  });

  render();
})();
