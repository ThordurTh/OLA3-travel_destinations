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

    clone.querySelector("#delete-destination").classList.add(destination._id);
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

    const deleteButton = clone.querySelector("#delete-destination");
    deleteButton.setAttribute("data-id", destination._id);

    deleteButton.addEventListener("click", function () {
      const travelDestinationId = this.getAttribute("data-id");
      const articleElement = this.closest("article");

      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI1NTgwZjIxMjk1ZmU3ODM5ZGVhM2UiLCJpYXQiOjE2OTY5NTA3MTEsImV4cCI6MTY5Njk1NDMxMX0.KpsLs89qG5shx27tAWNYPMNOUPT3rzJM4WXUabcPIBQ`,
          "Content-Type": "application/json",
        },
      };

      fetch(
        `http://localhost:3000/travel_destinations/${travelDestinationId}`,
        options
      )
        .then((response) => response.json())
        .then((response) => {
          console.log(response);

          // Remove the corresponding <article> element from the DOM
          articleElement.remove();
        })
        .catch((err) => console.error(err));
    });

    // Append the cloned and updated template to the target div
    destinationDiv.appendChild(clone);
  });
}
