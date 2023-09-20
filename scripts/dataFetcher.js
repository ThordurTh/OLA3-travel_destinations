const serverUrl = "http://localhost:3000/travel_destinations";

let destinationsData;

window.onload = (event) => {
  fetch(serverUrl)
    .then((response) => response.json())
    .then((data) => {
      //   console.log("Data from server:", data);
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
  destinationsData.forEach((destination) => {
    const clone = document.importNode(template.content, true);

    // Update the content of the cloned template
    // clone.querySelector(".image").src = ""
    clone.querySelector(".country").textContent = destination.country;
    clone.querySelector(".link").href = destination.link;
    clone.querySelector(".title").textContent = destination.title;
    clone.querySelector(
      ".date"
    ).textContent = `${destination.departureDate} - ${destination.arrivalDate}`;
    clone.querySelector(".description").textContent = destination.description;

    // Append the cloned and updated template to the target div
    destinationDiv.appendChild(clone);
  });
}
