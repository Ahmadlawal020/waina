const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById, // <-- Import the new controller
  createNewUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

// const verifyJWT = require("../middleware/verifyJWT");
// router.use(verifyJWT); // Apply JWT middleware if needed

// Route for operations on all users
router
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

// Route for getting a single user by ID
router.get("/:id", getUserById);

module.exports = router;
