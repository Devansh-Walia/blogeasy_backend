const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //A salt is a random string that makes the hash unpredictable.
    const salt = await bcrypt.genSalt(10);
    // generate a hashed password for the user
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    // make a user object with the hashed password 
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save(); // save tb user to the database
    res.status(200).json(user); // return ok
  } catch (err) {
    res.status(500).json(err); // return error
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!"); // if not return error
    // validate the password
    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!"); // if not return error

    const { password, ...others } = user._doc; // remove the password from the response
    res.status(200).json(others); // return rest of the user
  } catch (err) {
    res.status(500).json(err); // return error
  }
});

module.exports = router;
