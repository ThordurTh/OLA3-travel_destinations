// ~~~~ Register Request ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const registerForm = document.querySelector("#register-form");

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = new FormData(registerForm);
  let email = data.get("email");
  let password = data.get("password");
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    };
    const response = await fetch("http://localhost:3000/signup", options);
    const data = await response.json();
    console.log(data);
    window.location.href = "/login.html";
  } catch (error) {
    console.log(error);
  }
});
