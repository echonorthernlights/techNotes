const express = require("express");
const path = require("path");
const {
  getAll,
  registerUser,
  updateUser,
  deleteUser,
  getById,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getAll).post(registerUser);
router.route("/:id").put(updateUser).delete(deleteUser).get(getById);

router.route("^/$|/index(.html)?").get((req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
