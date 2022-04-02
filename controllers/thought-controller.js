const { Thought, User } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400);
      });
  },

  // retrieve only one thought
  getOneThought({ params }, res) {
    Thought.findOne({ id: params.id })
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create a NEW THOUGHT!
  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        console.log({ _id });
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this is id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  // add a reaction to a thought!
  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this is id" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // update a thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .populate({ path: "thoughts", select: "-__v" })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res
            .status(404)
            .json({ message: "no thought was found with this id" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        res.sendStatus(400);
      });
  },
  // delete a thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ id: params.id })
      .then((deletedThought) => {
        if (!deletedThought) {
          res.status(404).json({ message: "Thought not found" });
          return;
        }
        // return User.findOneAndUpdate(
        //   { _id: params.id },
        //   { $pull: { Thoughts: params.id } },
        //   { new: true }
        // );
        // })
        // .then((dbUserData) => {
        //   if (!dbUserData) {
        //     res
        //       .status(404)
        //       .json({ message: "No User associated with this id was found!" });
        //     return;
        //   }
        res.json(deletedThought);
      })
      .catch((err) => res.status(400).json(err));
  },

  // remove a reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res
            .status(404)
            .json({ message: "No thoughts with this particular ID!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
