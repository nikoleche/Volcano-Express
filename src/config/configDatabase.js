const mongoose = require("mongoose");
require("../models/User");
require("../models/Volcano");

async function configDatabase() {
  const connectionString = "mongodb://localhost:27017/magma-db";

  await mongoose.connect(connectionString);

  console.log("Database linked successfully");
}

module.exports = { configDatabase };
