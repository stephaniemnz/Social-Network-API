const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { getRandomName, getRandomThoughts } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  let userCheck = await connection.db
    .listCollections({ name: "users" })
    .toArray();
  if (userCheck.length) {
    await connection.dropCollection("users");
  }

  let thoughtsCheck = await connection.db
    .listCollections({ name: "thoughts" })
    .toArray();
  if (thoughtsCheck.length) {
    await connection.dropCollection("thoughts");
  }

  const users = [];
  const thoughts = [];

  for (let i = 0; i < 20; i++) {
    const fullName = getRandomName();
    const first = fullName.split(" ")[0];
    const last = fullName.split(" ")[1];
    const username = `${first}${Math.floor(
      Math.random() * (99 - 18 + 1) + 18
    )}`;

    const userThoughts = getRandomThoughts(5);
    users.push({
      username,
      email: `${username.toLowerCase()}@example.com`,
    });
    userThoughts.forEach((thoughtText) => {
      thoughts.push({
        thoughtText,
        username: username,
      });
    });
  }

  const userData = await User.insertMany(users);
  const thoughtData = await Thought.insertMany(thoughts);

  console.table(users);
  console.table(thoughts);

  process.exit(0);
});
