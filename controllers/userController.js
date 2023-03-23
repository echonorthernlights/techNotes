const User = require("../models/userModel");
const Note = require("../models/noteModel");

//@desc get all users
//@access PUBLIC
//@route GET /users
const getAll = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    if (!users?.length) {
      return res.status(404).json({ message: "No users found !!" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Sommething went wrong ...." });
  }
};

//@desc get user by id
//@access PUBLIC
//@route GET /users/:id
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
    const { username, password, roles } = req.body;
    console.log(username, password, roles);

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
      return res.status(400).json({ message: "All fields are required !!" });
    }
    const existingUser = await User.findOne({ username }).lean().exec();

    if (existingUser) {
      return res.status(409).json({ message: "User already exists !!" });
    }

    let newUser = {
      username,
      roles,
      password,
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
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID not provided !!" });
    }

    // check if user has note(s)
    const hasNote = await Note.findOne({ userId: id }).lean().exec();
    if (hasNote) {
      return res.status(401).json({
        message: "This user has assigned note(s), it can't be deleted !!",
      });
    }

    const existingUser = await User.findById(id).exec();
    if (existingUser) {
      const result = await User.findOneAndDelete({ _id: req.params.id });
      const reply = `Username ${result.username} with ID : ${result._id} deleted succssfully`;
      res.status(200).json({ message: "User deleted succesfully!!", reply });
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
    const { username, password, roles, active } = req.body;
    const { id } = req.params;

    if (
      !id ||
      !username ||
      !Array.isArray(roles) ||
      !roles.length ||
      typeof active !== "boolean"
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findById(id).exec();

    if (!existingUser) {
      return res.status(404).json({ message: "User not found !!" });
    }
    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "Duplicate username !!" });
    }

    existingUser.username = username;
    existingUser.roles = roles;
    existingUser.active = active;
    if (password) {
      existingUser.password = password;
    }

    const updatedUser = await existingUser.save();
    res
      .status(200)
      .json({ message: "User updated succesfully!!", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Sommething went wrong ...." });
  }
};

module.exports = { getAll, getById, registerUser, deleteUser, updateUser };
