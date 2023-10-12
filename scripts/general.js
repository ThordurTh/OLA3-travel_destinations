if (localStorage.getItem("token") !== null) {
  console.log("loggedin");
  document.querySelector(".logged_out").classList.add("hide");
} else {
  console.log("loggedout");
  document.querySelector(".logged_in").classList.add("hide");
}
