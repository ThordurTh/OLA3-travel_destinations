// ~~~~ Login Request ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get the form element by its ID
const loginForm = document.querySelector("#login-form");

// Add an event listener to the form's submit event
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Get the form data
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // Create an object with the form data
  const formData = { email, password };

  try {
    // Send a POST request to your login route
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(formData), // Convert the data to JSON format
    });

    // Check the response status
    if (response.ok) {
      // Successful login; handle the response (e.g., store the token)
      const data = await response.json();
      const token = data.token;
      console.log(token);
      // You can now store the token and perform any actions for a successful login.
      localStorage.setItem("token", token);
      console.log(`local storage: ${localStorage.getItem("token")}`);
    } else {
      // Handle login failure (e.g., display an error message)
      console.error("Login failed.");
    }
  } catch (error) {
    // Handle any network or server errors
    console.error("An error occurred:", error);
  }
});
