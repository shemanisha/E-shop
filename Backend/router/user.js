const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");

//New user registration
router.post("/register", (req, res) => {
  let {
    name,
    email,
    passwordHash,
    phone,
    isAdmin,
    apartment,
    zip,
    city,
    country,
  } = req.body;
  passwordHash = bcrypt.hashSync(passwordHash, 10);
  const user = new User({
    name,
    email,
    passwordHash,
    phone,
    isAdmin,
    apartment,
    zip,
    city,
    country,
  });
  user
    .save()
    .then((user) => {
      return res.status(201).json({
        user: user,
        message: "User registered successfully",
        success: true,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        err: err.message,
        success: false,
      });
    });
});

//get User list
router.get("/getUsers", (req, res) => {
  User.find()
    .select("-passwordHash")
    .then((userList) => {
      return res.status(200).json({
        users: userList,
        success: true,
        message: "Users fetched successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        err: err.message,
        success: false,
      });
    });
});

//get user by id
router.get("/:userId", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    return res.status(400).send("Invalid user id");
  }
  User.findById(req.params.userId)
    .select("-passwordHash")
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User doesn't exist",
          success: false,
        });
      }
      return res.status(200).json({
        users: user,
        success: true,
        message: "User fetched successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        err: err.message,
        success: false,
      });
    });
});

//update User
router.put("/:userId", (req, res) => {
  let {
    name,
    email,
    passwordHash,
    phone,
    isAdmin,
    apartment,
    zip,
    city,
    country,
  } = req.body;

  User.findById(req.params.userId).then((user) => {
    if (req.body.passwordHash) {
      passwordHash = bcrypt.hashSync(passwordHash, 10);
    } else {
      passwordHash = user.passwordHash;
    }
  });

  User.findByIdAndUpdate(req.params.userId, {
    name: name,
    email: email,
    passwordHash: passwordHash,
    phone: phone,
    isAdmin: isAdmin,
    apartment: apartment,
    zip: zip,
    city: city,
    country: country,
  })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({
          message: "User doesn't exist",
          success: false,
        });
      }
      return res.status(200).json({
        User: updatedUser,
        message: "User updated successfully",
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
        success: false,
      });
    });
});

//delete user
router.delete("/:userId", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    return res.status(400).send("Invalid user id");
  }
  User.findByIdAndDelete(req.params.userid)
    .then((user) => {
      return res.status(200).json({
        message: "Users deleted successfully",
        success: true,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        err: err.message,
        success: false,
      });
    });
});

module.exports = router;