// Import necessary modules
const { ObjectId } = require("mongoose").Types;
const { User, Thoughts } = require("../models");

// Function to calculate the total number of users
const headCount = async () => {
  try {
    const numberOfUsers = await User.countDocuments();
    return numberOfUsers;
  } catch (err) {
    throw err;
  }
};

// Function to calculate the grade of a user by aggregating assignment scores
const calculateGrade = async (userId) => {
  try {
    const gradeAggregate = await User.aggregate([
      { $match: { _id: ObjectId(userId) } },
      { $unwind: "$assignments" },
      {
        $group: {
          _id: "$_id",
          overallGrade: { $avg: "$assignments.score" },
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
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      const userObj = {
        users,
        headCount: await headCount(),
      };
      res.json(userObj);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .lean();

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }

      const grade = await calculateGrade(req.params.userId);

      res.json({
        user,
        grade,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete a user and remove them from the thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({
        _id: req.params.userId,
      });

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }

      const thoughts = await Thoughts.findOneAndUpdate(
        { users: req.params.userId },
        { $pull: { users: req.params.userId } },
        { new: true }
      );

      if (!thoughts) {
        return res
          .status(404)
          .json({ message: "User deleted, but no thoughts found" });
      }

      res.json({ message: "User successfully deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Add a user
  async addUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { assignments: req.body } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async removeUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { assignments: { _id: req.params.assignmentId } } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
