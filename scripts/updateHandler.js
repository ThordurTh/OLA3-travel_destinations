const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("id");
console.log(itemId);

const serverUrl = `http://localhost:3000/travel_destinations/${itemId}`;

let destinationData;

window.onload = (event) => {
  const options = {
    method: "GET",
  };
  fetch(serverUrl)
    .then((response) => response.json())
    .then((data) => {
      destinationData = data;
      addData();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

function addData() {
  console.log(destinationData);
  // Country
  document.querySelector("#country").value = destinationData[0].country;

  // Title
  document.querySelector("#title").value = destinationData[0].title;

  // Link
  document.querySelector("#link").value = destinationData[0].link;

  // Dates
  const [arrivalDate, departureDate] = formatDates(
    destinationData[0].arrivalDate,
    destinationData[0].departureDate
  );
  document.querySelector("#arrival_date").value = arrivalDate;
  document.querySelector("#departure_date").value = departureDate;

  // Image
  //not happening

  // Description
  document.querySelector("#description").value = destinationData[0].description;
}

function formatDates(dateString1, dateString2) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedDate1 = formatDate(dateString1);
  const formattedDate2 = formatDate(dateString2);

  return [formattedDate1, formattedDate2];
}

// imageToBase64
const imageToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
  });

const form = document.querySelector("form");

// Update destination
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

    // const formattedArrival = dateFormatter(arrivalDate);
    // const formattedDeparture = dateFormatter(departureDate);
    const formattedArrival = arrivalDate;
    const formattedDeparture = departureDate;

    try {
      const fileInput = document.getElementById("image");
      let optionsBody;

      if (fileInput.files.length > 0) {
        // update image
        optionsBody = new URLSearchParams({
          country: country,
          title: title,
          link: link,
          arrivalDate: formattedArrival,
          departureDate: formattedDeparture,
          image: imageString,
          description: description,
        });
      } else {
        // don't update image
        optionsBody = new URLSearchParams({
          country: country,
          title: title,
          link: link,
          arrivalDate: formattedArrival,
          departureDate: formattedDeparture,
          description: description,
        });
      }

      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: optionsBody,
      };

      const response = await fetch(serverUrl, options);
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
