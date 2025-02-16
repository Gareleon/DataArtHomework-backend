const express = require("express");

const {
  postAJoke,
  postAVote,
  getRandomJoke,
  updateJoke,
  deleteJoke,
} = require("../controllers/jokeController");
const router = express.Router();

//Post a vote to MongoDB
router.post("/", postAJoke);

// Post a vote to MongoDB
router.post("/:id/vote", postAVote);

//Get a single joke from MongoDB
router.get("/", getRandomJoke);

//Update a joke from MongoDB
router.put("/:id", updateJoke);

//Delete a joke from MongoDB
router.delete("/:id", deleteJoke);

module.exports = router;
