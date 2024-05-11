// Import necessary modules
const { ObjectId } = require("mongoose").Types;
const { Thoughts } = require("../models");

// Function to calculate the total number of thoughts
const headCount = async () => {
  try {
    const numberOfThoughts = await Thoughts.countDocuments();
    return numberOfThoughts;
  } catch (err) {
    throw err;
  }
};

// Function to calculate the grade of a thought
const calculateGrade = async (thoughtId) => {
  try {
    const gradeAggregate = await Thoughts.aggregate([
      { $match: { _id: ObjectId(thoughtId) } },
      {
        $group: {
          _id: "$_id",
          overallGrade: { $avg: "$score" },
        },
      },
    ]);
    return gradeAggregate[0];
  } catch (err) {
    throw err;
  }
};

// Export the controller methods
module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thoughts.find();
      const thoughtsObj = {
        thoughts,
        headCount: await headCount(),
      };
      res.json(thoughtsObj);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thoughts.findOne({ _id: req.params.thoughtId })
        .select("-__v")
        .lean();

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }

      const grade = await calculateGrade(req.params.thoughtId);

      res.json({
        thought,
        grade,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thoughts.create(req.body);
      res.status(201).json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thoughts.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }

      res.json({ message: "Thought successfully deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Add a thought
  async addThought(req, res) {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { thoughts: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }

      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Remove a thought
  async removeThought(req, res) {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { thoughts: { _id: req.params.thoughtId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }

      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
