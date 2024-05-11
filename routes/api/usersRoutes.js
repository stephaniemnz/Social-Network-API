const router = require("express").Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  addAssignment,
  removeAssignment,
} = require("../../controllers/userController");

router.route("/").get(getUsers).post(createUser);

router.route("/:userId").get(getSingleUser).delete(deleteUser);

router.route("/:userId/assignments").post(addAssignment);

router.route("/:userId/assignments/:assignmentId").delete(removeAssignment);

module.exports = router;
