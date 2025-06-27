const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc Get user by ID
// @route GET /users/:id
// @access Private
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const user = await User.findById(id).select("-password").lean();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, roles, status } =
    req.body;

  // Confirm required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check for duplicate email
  const duplicateEmail = await User.findOne({ email }).lean().exec();
  if (duplicateEmail) {
    return res
      .status(409)
      .json({ message: "This email is already registered." });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = {
    firstName,
    lastName,
    email,
    phoneNumber,
    password: hashedPassword,
    roles: Array.isArray(roles) && roles.length ? roles : ["Employee"],
    status: typeof status === "boolean" ? status : true, // Default to true if not provided
  };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({
      message: `New user ${user.firstName || ""} ${
        user.lastName || ""
      } created`,
    });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    roles,
    password,
    status,
  } = req.body;

  if (!id || !email) {
    return res.status(400).json({ message: "ID and email are required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const duplicateEmail = await User.findOne({ email }).lean().exec();
  if (duplicateEmail && duplicateEmail._id.toString() !== id) {
    return res
      .status(409)
      .json({ message: "This email is already registered." });
  }

  user.firstName = firstName ?? user.firstName;
  user.lastName = lastName ?? user.lastName;
  user.email = email;
  user.phoneNumber = phoneNumber ?? user.phoneNumber;
  user.roles = Array.isArray(roles) && roles.length ? roles : user.roles;
  user.status = typeof status === "boolean" ? status : user.status;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  user.updatedAt = new Date();

  const updatedUser = await user.save();

  res.json({
    message: `${updatedUser.firstName || ""} ${
      updatedUser.lastName || ""
    } updated`,
  });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const userDetails = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    id: user._id,
  };

  await user.deleteOne();

  res.json({
    message: `User ${userDetails.firstName || ""} ${
      userDetails.lastName || ""
    } with ID ${userDetails.id} deleted`,
  });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUserById,
};
