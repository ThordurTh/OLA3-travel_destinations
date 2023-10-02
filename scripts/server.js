// ~~~~ SETUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TravelDestination = require("./../schemas/DestinationSchema");

// Create Express Application
const app = express();
const port = 3000;

// Middleware Setup:
app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

// CORS Configuration
app.use(cors());

// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/travel_log", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ~~~~ GET Route ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get("/travel_destinations", async (req, res) => {
  try {
    const destinations = await TravelDestination.find();

    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

// ~~~~ POST Route ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.post("/travel_destinations", async (req, res) => {
  // Recieve data from formHandler fetch request
  const {
    country,
    title,
    link,
    arrivalDate,
    departureDate,
    image,
    description,
  } = req.body;

  // Check if country or title has value
  if (!country || !title) {
    return res
      .status(400)
      .json({ error: "Both country and title are required fields." });
  }

  // Create a new instance of the model with the received data
  const newDestination = new TravelDestination({
    country,
    title,
    link,
    arrivalDate,
    departureDate,
    image,
    description,
  });

  // Save the data
  try {
    const result = await newDestination.save();
    res
      .status(201)
      .json({ message: "Destination added successfully!", data: result });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the destination." });
  }
});

// ~~~~ Server Start ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
