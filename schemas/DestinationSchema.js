// Import mongoose
const mongoose = require("mongoose");

// Define Mongoose Schema and Model:
const travelDestinationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  title: { type: String, required: true },
  link: { type: String },
  arrivalDate: { type: Date },
  departureDate: { type: Date },
  image: { type: String },
  description: { type: String },
});

module.exports = mongoose.model("travel_destination", travelDestinationSchema);
