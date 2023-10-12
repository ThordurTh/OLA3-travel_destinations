const serverUrl = "http://localhost:3000/travel_destinations";

let destinationsData;
let selectedItem;

window.onload = (event) => {
  const options = {
    method: "GET",
  };
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

    const [arrivalDate, departureDate] = formatDates(
      destination.arrivalDate,
      destination.departureDate
    );
    if (destination.arrivalDate !== "undefined undefined, ") {
      clone.querySelector(
        ".date"
      ).textContent = `${arrivalDate} - ${departureDate}`;
    }

    clone.querySelector(".description").textContent = destination.description;

    const updateButton = clone.querySelector("#update-destination");
    updateButton.addEventListener("click", () => {
      window.location.href = `/update_destination.html?id=${destination._id}`;
    });

    const deleteButton = clone.querySelector("#delete-destination");
    if (localStorage.getItem("token") !== null) {
      deleteButton.setAttribute("data-id", destination._id);

      // Add an event listener to handle delete button clicks
      deleteButton.addEventListener("click", function () {
        selectedItem = this.getAttribute("data-id");
        console.log(selectedItem);
        confirmationDialog.style.display = "flex";

        // const deleteButton = event.target.closest("#delete-destination");

        // if (deleteButton) {
        //   const travelDestinationId = deleteButton.getAttribute("data-id");
        //   const articleElement = deleteButton.closest("article");

        //   // Show the confirmation dialog
        //   const confirmationDialog = document.querySelector(
        //     ".confirmation-dialog"
        //   );
        //   confirmationDialog.style.display = "flex";

        //   // Handle the delete action when the user confirms
        //   document
        //     .getElementById("confirm-delete")
        //     .addEventListener("click", function () {
        //       // Hide the confirmation dialog
        //       confirmationDialog.style.display = "none";

        //   const options = {
        //     method: "DELETE",
        //     headers: {
        //       Authorization: `Bearer ${localStorage.getItem("token")}`,
        //       "Content-Type": "application/json",
        //     },
        //   };

        //   fetch(
        //     `http://localhost:3000/travel_destinations/${travelDestinationId}`,
        //     options
        //   )
        //     .then((response) => response.json())
        //     .then((response) => {
        //       console.log(response);
        //       // Remove the corresponding <article> element from the DOM
        //       articleElement.remove();
        //     })
        //     .catch((err) => console.error(err));
        // });

        //   // Cancel the delete action if the user clicks "No" in the confirmation dialog
        //   document
        //     .getElementById("cancel-delete")
        //     .addEventListener("click", function () {
        //       // Hide the confirmation dialog
        //       confirmationDialog.style.display = "none";
        //     });
        // }
      });
    } else {
      clone.querySelector(".buttons-container").remove();
    }

    // Append the cloned and updated template to the target div
    destinationDiv.appendChild(clone);
  });
}

function formatDates(dateString1, dateString2) {
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = monthNames[date.getMonth()];
    const day = date.getDate().toString().padStart(2, "0");
    return `${day} ${month}-${year}`;
  };

  const formattedDate1 = formatDate(dateString1);
  const formattedDate2 = formatDate(dateString2);

  return [formattedDate1, formattedDate2];
}

const confirmationDialog = document.querySelector(".confirmation-dialog");
const confirmBtn = document.querySelector("#confirm-delete");
const cancelBtn = document.querySelector("#cancel-delete");

confirmBtn.addEventListener("click", () => {
  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  fetch(`http://localhost:3000/travel_destinations/${selectedItem}`, options)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      // Remove the corresponding <article> element from the DOM
      document
        .querySelector(`[data-id="${selectedItem}"]`)
        .closest("article")
        .remove();
    })
    .catch((err) => console.error(err));
  confirmationDialog.style.display = "none";
});
cancelBtn.addEventListener("click", () => {
  confirmationDialog.style.display = "none";
});
