const express = require("express");
const { configDatabase } = require("./config/configDatabase");
const { configExpress } = require("./config/configExpress");
const { configHbs } = require("./config/configHbs");
const { configRoutes } = require("./config/configRoutes");

const { register, login } = require("./services/userService");
const api = require("./services/volcanoService");
const { generateToken, verifyToken } = require("./services/jwt");

start();

async function start() {
  const app = express();

  await configDatabase();
  configHbs(app);
  configExpress(app);
  configRoutes(app);

  app.listen(3000, () => {
    console.log("Server started successfully");
    // test();
  });
}

async function test() {
  try {
    // READ ENTRY:
    // const volcanoId = "667573d1a1d359c7b46d83ad";
    // const userId = "66757574a0d6af1fcf176747";
    // const result = await api.getById(volcanoId);
    // console.log(result.voteList.length);
    // TESTING CREATE:
    // const result = await api.create(
    //   {
    //     name: "Mount Etna",
    //     location: "Sicily Italy",
    //     elevation: 209,
    //     lastEruption: 2009,
    //     image: "http://localhost:3000/static/images/etna.jpg",
    //     typeVolcano: "Stratovolcanoes",
    //     description: "Etna is a volcano in Sicily, Italy",
    //   },
    //   "66756429e04900489169a33b"
    // );
    // TESTING SESSION:
    //   const token = generateToken(result);
    // const data = await api.getById("66756facf26eed42137c6bba");
    // console.log(data);
    // TESTING UPDATE:
    // const formData = {
    //   name: "Hunga Tonga",
    //   location: "Tonga Islands",
    //   elevation: 114,
    //   lastEruption: 2024,
    //   image: "http://localhost:3000/static/images/hunga-tonga.jpg",
    //   typeVolcano: "Submarine",
    //   description:
    //     "Hunga Tonga-Hunga is a submarine volcano in the South Pacific located about 30 km south of the submarine volcano of Fonuafo'ou and 65 km north of Tongatapu, Tonga's main island. It is part of the highly active Kermadec-Tonga subduction zone and its associated volcanic arc, which extends from New Zealand north-northeast to Fiji, and is formed by the subduction of the Pacific Plate under the Indo-Australian Plate. It lies about 100 km above a very active seismic zone.",
    // };
    // TESTING DELETE:
    // const userId = "66756429e04900489169a33b";
    // const volcanoId = "6675721745faf988c3c0c880";
    // const result = await api.update(volcanoId, formData, userId);
    // const volcanoId = "6675721745faf988c3c0c880";
    // const userId = "66756429e04900489169a33b";
    // await api.deleteById(volcanoId, userId);
    // TESTING VOTES
    // const volcanoId = "667573d1a1d359c7b46d83ad";
    // const userId = "0000000099999";
    // const result = await api.addVote(volcanoId, userId);
    // console.log(result);
  } catch (error) {
    console.log("An error occurred");
    console.error(error.message);
  }
}
