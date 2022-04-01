const router = require("express").Router();

const {
  getAllUsers,
  getUserById,
} = require("../../controllers/user-controller");

router.route("/").get().post();

router.route("/:id").get().put().delete();

module.exports = router;
