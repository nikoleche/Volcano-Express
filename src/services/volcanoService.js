const { Volcano } = require("../models/Volcano");

async function getAll() {
  return Volcano.find().lean();
}

async function getById(id) {
  return Volcano.findById(id).lean();
}

async function create(data, authorId) {
  const entry = new Volcano({
    name: data.name,
    location: data.location,
    elevation: data.elevation,
    lastEruption: data.lastEruption,
    image: data.image,
    typeVolcano: data.typeVolcano,
    description: data.description,
    owner: authorId,
  });

  await entry.save();
  return entry;
}

async function update(id, data, userId) {
  const entry = await Volcano.findById(id);

  if (!entry) {
    throw new ReferenceError("Entry not found" + id);
  }

  if (entry.owner.toString() !== userId) {
    throw new Error("Access Denied");
  }

  entry.name = data.name;
  entry.location = data.location;
  entry.elevation = data.elevation;
  entry.lastEruption = data.lastEruption;
  entry.image = data.image;
  entry.typeVolcano = data.typeVolcano;
  entry.description = data.description;
  entry.owner = userId;

  await entry.save();

  return entry;
}

async function searchVolcanoes(name, typeVolcano) {
  const query = {};
  if (name) {
    query.name = new RegExp(name, "i");
  }

  if (typeVolcano && typeVolcano !== "---") {
    query.typeVolcano = typeVolcano;
  }
  return Volcano.find(query).lean();
}

async function addVote(volcanoId, userId) {
  const entry = await Volcano.findById(volcanoId);

  if (!entry) {
    throw new ReferenceError("Entry not found" + volcanoId);
  }
  if (entry.owner.toString() === userId) {
    throw new Error("Voting for your own publication is forbidden");
  }

  if (entry.voteList.find((vote) => vote.toString() === userId)) {
    throw new Error("You tried to vote for the same publication again");
  }

  entry.voteList.push(userId);

  await entry.save();
  return entry;
}

async function deleteById(id, userId) {
  const entry = await Volcano.findById(id);

  if (!entry) {
    throw new ReferenceError("Entry not found" + id);
  }

  if (entry.owner.toString() !== userId) {
    throw new Error("Access Denied");
  }

  await Volcano.findByIdAndDelete(id);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById,
  addVote,
  searchVolcanoes,
};
