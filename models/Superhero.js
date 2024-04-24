const mongoose = require('mongoose');

const powerStatsSchema = new mongoose.Schema(
  {
    intelligence: String,
    strength: String,
    speed: String,
    durability: String,
    power: String,
    combat: String,
  },
  { _id: false } // Disable the automatic _id field for the subdocument
);

const superheroSchema = new mongoose.Schema({
  name: { type: String, required: true },
  powerstats: powerStatsSchema,
  biography: {
    'full-name': String,
  },
  image: {
    url: String,
  },
});

const Superhero = mongoose.model('Superhero', superheroSchema);
module.exports = Superhero;