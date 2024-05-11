const { Schema, model } = require("mongoose");
const assignmentSchema = require("./Assignment");

// Schema to create User model
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 100,
      match: /.+\@.+\..+/,
    },
    github: {
      type: String,
      required: true,
      maxLength: 50,
    },
    assignments: [assignmentSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = model("User", userSchema);

module.exports = User;
