const router = require("express").Router();

const {
  getAllThoughts,
  getOneThought,
  createThought,
  updateThought,
  removeThought,
  removeReaction,
  createReaction,
} = require("../../controllers/thought-controller");

router.route("/").get(getAllThoughts);
router.route("/:userId").post(createThought);

router
  .route("/:thoughtId")
  .get(getOneThought)
  .put(updateThought)
  .delete(removeThought);

router.route("/:thoughtId/reactions").post(createReaction);
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;
