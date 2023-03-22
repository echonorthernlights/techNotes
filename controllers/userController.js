const User = require("../models/userModel");

//@desc get all users
//@access PUBLIC
//@ GET /users
const getAll = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ message: "No users found !!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Sommething went wrong ...." });
  }
};

//@desc get user by id
//@access PUBLIC
//@ GET /users/:id
const getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found !!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Sommething went wrong ...." });
  }
};

//@desc register a new user
//@access PUBLIC
//@ POST /users
const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      username: req.body.username,
    }).select("-password");
    if (existingUser) {
      return res.status(400).json({ message: "User already exists !!" });
    }
    let newUser = {
      username: req.body.username,
      password: req.body.password,
    };
    newUser = await User.create(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ...." });
  }
};

//@desc delete a user
//@access PUBLIC
//@ DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);
    if (existingUser) {
      await User.findOneAndDelete({ _id: req.params.id });
      res.status(200).json({ message: "User deleted succesfully!!" });
    } else {
      res.status(404).json({ message: "User not found!!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Sommething went wrong ...." });
  }
};

//@desc update a user
//@access PUBLIC
//@ PUT /users/:id
const updateUser = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);
    if (existingUser) {
      existingUser.username = req.body.username;
      existingUser.password = req.body.password;
      const updatedUser = await existingUser.save();
      res
        .status(200)
        .json({ message: "User updated succesfully!!", updateUser });
    } else {
      res.status(404).json({ message: "User not found!!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Sommething went wrong ...." });
  }
};

module.exports = { getAll, getById, registerUser, deleteUser, updateUser };
