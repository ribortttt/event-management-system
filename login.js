(function () {
  "use strict";

  const loginForm = document.querySelector(".login-card");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!loginForm || !emailInput || !passwordInput) {
    return;
  }

  const accounts = [
    {
      email: "user@email.com",
      password: "user123",
      role: "user",
      redirect: "user-home.html",
    },
    {
      email: "admin@email.com",
      password: "admin123",
      role: "admin",
      redirect: "admindash.html",
    },
  ];

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    const account = accounts.find(function (item) {
      return item.email === email && item.password === password;
    });

    if (!account) {
      alert("Invalid email or password. Please check your credentials.");
      passwordInput.value = "";
      passwordInput.focus();
      return;
    }

    sessionStorage.setItem(
      "ems_logged_in",
      JSON.stringify({
        email: account.email,
        role: account.role,
      }),
    );

    window.location.href = account.redirect;
  });
})();
