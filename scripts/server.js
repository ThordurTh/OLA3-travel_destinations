// ~~~~ SETUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors"); // Import the cors package

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS to allow requests from your HTML page's domain
app.use(cors());

let uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("travel_log");
const tdCollection = db.collection("travel_destinations");

// ~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get("/travel_destinations", async (req, res) => {
  try {
    // Fetch data from MongoDB collection
    const destinations = await tdCollection.find().toArray();

    // Send the data as JSON response
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

// ~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.post("/travel_destinations", async (req, res) => {
  // Extract the country and capital values from the request body
  const {
    country,
    title,
    link,
    arrivalDate,
    departureDate,
    image,
    description,
  } = req.body;

  // Check if the values are provided
  if (!country || !title) {
    return res
      .status(400)
      .json({ error: "Both country and title are required fields." });
  }

  // Insert the data into the MongoDB collection
  const result = await tdCollection.insertOne({
    country: country,
    title: title,
    link: link,
    arrivalDate: arrivalDate,
    departureDate: departureDate,
    image: image,
    description: description,
  });

  // Respond with a success message and status code
  res
    .status(201)
    .json({ message: "Destination added successfully!", data: result });
});

// ~~~ SERVER START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// app.listen is called when you run "node scripts/server.js"
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
