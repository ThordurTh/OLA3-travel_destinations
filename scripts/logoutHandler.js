const logout = document.querySelector(".logout");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  console.log("logged out");
  document
    .querySelectorAll(".buttons-container")
    .forEach((container) => container.remove());
  document.querySelector(".logged_out").classList.remove("hide");
  document.querySelector(".logged_in").classList.add("hide");
  window.location.href = "index.html";
});
