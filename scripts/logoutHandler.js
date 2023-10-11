const logout = document.querySelector(".logout");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  console.log("logged out");
});
