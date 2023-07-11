import asyncHandler from "express-async-handler";
import sendToken from "../utils/sendToken.js";
import User from "../models/userModel.js";
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  sendToken(user, 201, res);
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    rse.status(401);
    throw new Error("User is not existed");
  } else {
    if (await user.comparePassword(password)) {
      sendToken(user, 200, res);
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  }
});
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json({
      success: true,
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
  }
  const updatedUser = await user.save();
  sendToken(updatedUser, 201, res);
});
//Admin Operation
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    success: true,
    users: {
      users,
    },
  });
});
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const userList = await User.findById(userId).select("-password");
  res.status(200).json({
    success: true,
    userList,
  });
});
const deleteUser = asyncHandler(async (req, res) => {
  await User.findOneAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "the user is deleted",
  });
});
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  //find the user
  const user = await User.findById(userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
  }
  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
  });
});
export {
  createUser,
  login,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUser,
  getUser,
  deleteUser,
};
