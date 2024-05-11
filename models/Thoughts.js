const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");

// Schema to create Thoughts model
const thoughtsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thoughtText: {
      type: String,
      required: true,
      maxLength: 280,
    },
    reactions: [reactionSchema],
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      virtuals: true,
    },
    toObject: {
      getters: true,
      virtuals: true,
    },
  }
);

thoughtsSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thoughts = model("Thoughts", thoughtsSchema);

module.exports = Thoughts;
