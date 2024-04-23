const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Superhero = require("./models/Superhero");
import('node-fetch').then(({ default: fetch }) => {
    // Use the `fetch` function here
  });

require("dotenv").config();

app.set("view engine", "ejs");

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const superheroIds = [
    332, 346, 107, 149, 659, 313, 30, 708, 106, 579, 697, 536, 703, 251,
]; // Array of superhero IDs to retrieve from the API

async function populateDatabase() {
    try {
        // Connect to MongoDB using the connection string from the .env file
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        for (const superheroId of superheroIds) {
            // Make API request to retrieve superhero data using Fetch API
            const response = await fetch(
                `https://superheroapi.com/api/${process.env.SUPERHERO_API_KEY}/${superheroId}`
            );
            const superheroData = await response.json();

            // Create a new superhero document based on the schema
            const superhero = new Superhero({
                name: superheroData.name,
                powerstats: superheroData.powerstats,
                biography: {
                    "full-name": superheroData.biography["full-name"],
                },
                image: {
                    url: superheroData.image.url,
                },
            });

            // Save the superhero document to the database
            await superhero.save();
            console.log(
                `Superhero ${superheroData.name} populated successfully!`
            );
        }

        console.log("Database populated successfully!");
    } catch (error) {
        console.error("Error populating database:", error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
}

populateDatabase();
