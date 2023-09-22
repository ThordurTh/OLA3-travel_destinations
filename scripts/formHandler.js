const form = document.querySelector("form");
const inputElements = document.querySelectorAll("input");
const imageInput = document.getElementById("image");

imageInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];

  if (file) {
    try {
      const base64Image = await imageToBase64(file);

      // You can now use base64Image as needed, such as sending it to your server or storing it in a JavaScript variable.
    } catch (error) {
      console.error(error);
    }
  }
});

inputElements.forEach((inputElement) => {
  inputElement.addEventListener("change", () => {
    if (inputElement.value.trim() !== "") {
      inputElement.classList.add("input-good");
    } else {
      inputElement.classList.remove("input-good");
    }
  });
});

// Add a blur event listener to remove the class when the input loses focus
inputElements.forEach((inputElement) => {
  inputElement.addEventListener("blur", () => {
    if (inputElement.value.trim() !== "") {
      inputElement.classList.add("input-good");
    } else {
      inputElement.classList.remove("input-good");
    }
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  let country = data.get("country");
  let title = data.get("title");
  const link = data.get("link");
  const arrivalDate = data.get("arrival_date");
  const departureDate = data.get("departure_date");
  const image = data.get("image");
  const description = data.get("description");

  // Transform the country to uppercase
  country = country.toUpperCase();

  // Capitalize the first letter of the title
  title = title.charAt(0).toUpperCase() + title.slice(1);

  // Check if the link starts with the allowed prefixes
  if (
    !link.startsWith("https://www.google.com/maps/") &&
    !link.startsWith("https://maps.app.goo.gl/")
  ) {
    const errorMessage = "Only Google Maps links allowed.";
    document.getElementById("error-message").textContent = errorMessage;
    return; // Prevent form submission
  } else {
    document.getElementById("error-message").textContent = ""; // Clear any previous error message
  }

  const formattedArrival = dateFormatter(arrivalDate);
  const formattedDeparture = dateFormatter(departureDate);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      country: country,
      title: title,
      link: link,
      arrivalDate: formattedArrival,
      departureDate: formattedDeparture,
      image: image,
      description: description,
    }),
  };

  fetch("http://localhost:3000/travel_destinations", options)
    .then((response) => {
      // console.log(response);
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data.message);
        form.reset();
      }
    })
    .catch((err) => console.error(err));
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
