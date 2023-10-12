// ~~~~ SETUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Import required modules
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("./../passport-config"); // Import your Passport configuration
const mongoose = require("mongoose");
const User = require("./../schemas/User");
const TravelDestination = require("./../schemas/DestinationSchema");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

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
// ~~~~ GET a specific route ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get("/travel_destinations/:id", async (req, res) => {
  try {
    const destination = await TravelDestination.find({ _id: req.params.id });

    res.status(200).json(destination);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});
// ~~~~ Update a specific route ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// PUT Route to update a specific travel destination by ID
app.put("/travel_destinations/:id", async (req, res) => {
  const {
    country,
    title,
    link,
    arrivalDate,
    departureDate,
    image,
    description,
  } = req.body;

  const updateFields = {
    country,
    title,
    link,
    arrivalDate,
    departureDate,
    image,
    description,
  };

  try {
    // Find the document by ID and update it
    const updatedDestination = await TravelDestination.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true } // To get the updated document as a response
    );

    if (!updatedDestination) {
      return res.status(404).json({ error: "Travel destination not found" });
    }

    res.json({
      message: "Destination updated successfully!",
      data: updatedDestination,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the destination." });
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

// ~~~~ DELETE Route ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.delete(
  "/travel_destinations/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    TravelDestination.deleteOne({ _id: req.params.id }).then((result) => {
      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Success" });
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    });
  }
);

// ~~~~ SIGNUP POST Route ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.post("/signup", async (req, res) => {
  // Recieve data from signupHandler fetch request
  const { email, password } = req.body;

  // Check if email or password has value
  if (!email || !password) {
    return res.status(400).json({ error: "Both fields are required" });
  }

  try {
    // Create a new instance of the User model with the hashed password
    const newUser = new User({
      email,
      password,
    });

    // Save the user data
    const result = await newUser.save();
    res.status(201).json({ message: "User added successfully!", data: result });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding a new user." });
  }
});

// ~~~~ LOGIN POST Route ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid login" });
    }

    if (await user.isValidPassword(req.body.password)) {
      const generatedToken = jwt.sign(
        { _id: user._id },
        process.env.jwt_secret
      );
      res.status(200).json({ token: generatedToken });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ~~~~ Server Start ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
