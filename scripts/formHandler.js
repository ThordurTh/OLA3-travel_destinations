const form = document.querySelector("form");
const inputElements = document.querySelectorAll("input");

inputElements.forEach((inputElement) => {
  inputElement.addEventListener("input", () => {
    // Clear the error messages when the user starts typing
    document.getElementById("country-error").textContent = "";

    if (inputElement.value.trim() !== "") {
      inputElement.classList.add("input-good");
    } else {
      inputElement.classList.remove("input-good");
    }
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  let country = data.get("country");
  let title = data.get("title");
  const link = data.get("link");
  const arrivalDate = data.get("arrival_date");
  const departureDate = data.get("departure_date");
  const image = document.querySelector("#image");
  const description = data.get("description");

  // Transform the country to uppercase
  country = country.toUpperCase();

  // Capitalize the first letter of the title
  title = title.charAt(0).toUpperCase() + title.slice(1);

  // Check if the country and title are empty
  if (country.trim() === "") {
    document.getElementById("country-error").textContent =
      "*Country is required.";
  }

  if (title.trim() === "") {
    document.getElementById("country-error").textContent =
      "*Title is required.";
  }

  // Check if either field is empty and prevent form submission
  if (country.trim() === "" || title.trim() === "") {
    return; // Prevent form submission
  }

  // Check if the link starts with the allowed prefixes or if it's empty
  if (
    link.trim() === "" ||
    link.startsWith("https://www.google.com/maps/") ||
    link.startsWith("https://maps.app.goo.gl/")
  ) {
    // Clear any previous error message
    document.getElementById("error-message").textContent = "";

    const formattedArrival = dateFormatter(arrivalDate);
    const formattedDeparture = dateFormatter(departureDate);

    try {
      const imageString = await imageToBase64(image.files[0]);

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          country: country,
          title: title,
          link: link,
          arrivalDate: formattedArrival,
          departureDate: formattedDeparture,
          image: imageString,
          description: description,
        }),
      };

      const response = await fetch(
        "http://localhost:3000/travel_destinations",
        options
      );
      const data = await response.json();

      if (data.error) {
      } else {
        form.reset();

        // Display a success message
        document.getElementById("success-message").textContent =
          "Form submitted successfully!";

        // Redirect to index.html after 2 seconds
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    // Display an error message if the link doesn't start with allowed prefixes
    const errorMessage = "Only Google Maps links allowed.";
    document.getElementById("error-message").textContent = errorMessage;
    return; // Prevent form submission
  }
});

function dateFormatter(date) {
  // Convert the date string "YYYY-MM-DD" to an array of ["YYYY", "MM", "DD"]
  const inputDate = date.split("-");

  const monthNames = [
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

  // Format the date as "DD month, YYYY"
  const formattedDate = `${inputDate[2]} ${
    monthNames[Number(inputDate[1]) - 1]
  }, ${inputDate[0]}`;

  return formattedDate;
}

// imageToBase64
const imageToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
  });
