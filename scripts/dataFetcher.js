const serverUrl = "http://localhost:3000/travel_destinations";

let destinationsData;

window.onload = (event) => {
  fetch(serverUrl)
    .then((response) => response.json())
    .then((data) => {
      destinationsData = data;
      cloneTemplate();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

function cloneTemplate() {
  // Get a reference to the template element and the target div
  const template = document.querySelector("template");
  const destinationDiv = document.querySelector(".travel_destinations");

  // Loop through the data and populate the template
  destinationsData.forEach(async (destination) => {
    const clone = document.importNode(template.content, true);

    if (destination.image) {
      // Convert the base64 image to an actual image element
      const imageBase64 = destination.image;
      // Update the content of the image clone
      const imageContainer = clone.querySelector(".image");
      imageContainer.src = imageBase64; // Set the src attribute of the image
      imageContainer.alt = destination.title; // Set the alt attribute of the image
    }

    // Update the content of the cloned template
    clone.querySelector(".country").textContent = destination.country;
    if (destination.link) {
      clone.querySelector(".link").href = destination.link;
      clone.querySelector(".link").textContent = "View on Google Maps";
    }
    clone.querySelector(".title").textContent = destination.title;
    if (destination.arrivalDate !== "undefined undefined, ") {
      clone.querySelector(
        ".date"
      ).textContent = `${destination.arrivalDate} - ${destination.departureDate}`;
    }

    clone.querySelector(".description").textContent = destination.description;

    // Append the cloned and updated template to the target div
    destinationDiv.appendChild(clone);
  });
}
