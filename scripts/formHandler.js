const form = document.querySelector("form");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const country = data.get("country");
  const title = data.get("title");
  const link = data.get("link");
  const arrivalDate = data.get("arrival_date");
  const departureDate = data.get("departure_date");
  const image = data.get("image");
  const description = data.get("description");

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      country: country,
      title: title,
      link: link,
      arrivalDate: arrivalDate,
      departureDate: departureDate,
      image: image,
      description: description,
    }),
  };

  fetch("http://localhost:3000/travel_destinations", options)
    .then((response) => {
      console.log(response);
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
