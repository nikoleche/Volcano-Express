const { User } = require("../models/User");
const bcrypt = require("bcrypt");

const identityName = "email";

async function register(identity, username, password) {
  const existingUser = await User.findOne({ [identityName]: identity });

  if (existingUser) {
    throw new Error(`User ${identityName} already exists`);
  }

  const user = new User({
    [identityName]: identity,
    username,
    password: await bcrypt.hash(password, 10),
  });

  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Username already exists");
    }
  }

  return user;
}

async function login(identity, password) {
  const user = await User.findOne({ [identityName]: identity });

  if (!user) {
    throw new Error(`Incorrect ${identityName} or password`);
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error(`Incorrect ${identityName} or password`);
  }

  return user;
}

module.exports = {
  register,
  login,
};
