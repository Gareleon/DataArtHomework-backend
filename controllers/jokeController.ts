import type { Request, Response } from "express";

const Joke = require("../models/Joke");

//FUNCTION FOR CREATING A JOKE
const postAJoke = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;

    // Check if a joke with the same question and answer already exists to prevent duplicates
    const existingJoke = await Joke.findOne({ question, answer });

    if (existingJoke) {
      return res.status(400).send({ message: "This joke already exists!" });
    }

    // If no duplicate is found, create and save the new joke
    const newJoke = await new Joke({ ...req.body });
    await newJoke.save(
      res
        .status(200)
        .send({ message: "Succesfully created a joke!", joke: newJoke })
    );
  } catch (error) {
    console.error("Error during joke creation.", error);
    res.status(500).send({ message: "Failed to create joke." });
  }
};

// FUNCTION FOR VOTING ON A JOKE
const postAVote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // The joke's ID to vote on
    const { label } = req.body; // The emoji to vote with

    // Find the joke by ID
    const joke = await Joke.findById(id);

    if (!joke) {
      return res.status(404).send({ message: "Joke not found!" });
    }

    // Check if the vote label already exists in the joke's votes
    const existingVote = joke.votes.find((vote: any) => vote.label === label);

    if (existingVote) {
      // If the vote label already exists, increment the count
      existingVote.value += 1;
    } else {
      // If the vote label doesn't exist, create a new vote
      joke.votes.push({ label, value: 1 });
    }

    // Save the updated joke document
    await joke.save();

    res.status(200).json({ message: "Vote recorded!", joke });
  } catch (error) {
    console.error("Error during vote creation.", error);
    res.status(500).send({ message: "Failed to create vote." });
  }
};

//FUNCTION FOR GETTING A RANDOM JOKE
const getRandomJoke = async (req: Request, res: Response) => {
  try {
    const count = await Joke.countDocuments(); // Get total number of jokes
    console.log(count);

    if (count === 0) {
      return res.status(404).send({ message: "No jokes available!" });
    }

    const randomIndex = Math.floor(Math.random() * count); // Generate random index
    const joke = await Joke.findOne().skip(randomIndex); // Get random joke

    res.status(200).send(joke);
  } catch (error) {
    console.error("Error during joke fetching.", error);
    res.status(500).send({ message: "Failed to fetch joke." });
  }
};

//FUNCTION FOR UPDATING A JOKE
const updateJoke = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedJoke = await Joke.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedJoke) {
      res.status(404).send({ message: "Joke doesn't exist!" });
    }
    res.status(200).send({
      message: "Joke successfully updated!",
      joke: updatedJoke,
    });
  } catch (error) {
    console.error("Errpr during joke update.", error);
    res.status(500).send({ message: "Failed to update joke." });
  }
};

//FUNCTION FOR DELETING A JOKE
const deleteJoke = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedJoke = await Joke.findByIdAndDelete(id);
    if (!deletedJoke) {
      res.status(404).send({ message: "Joke doesn't exist!" });
    }
    res.status(200).send({
      message: "Joke successfully deleted!",
      joke: deletedJoke,
    });
  } catch (error) {
    console.error("Error during joke deletion.", error);
    res.status(500).send({ message: "Failed to delete joke." });
  }
};

module.exports = {
  postAJoke,
  postAVote,
  getRandomJoke,
  updateJoke,
  deleteJoke,
};
