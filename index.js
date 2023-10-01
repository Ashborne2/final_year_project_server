const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("./config/config");
const usermodel = require("./model/Usermodel");
const Usermodel = require("./model/Usermodel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = "thisismysecretkey";
const Claimmodel = require("./model/claimmodel");

app.use(cors());
app.use(express.json());

// app.get('/data', (req, res) => {
//     const collection = client.db("mydatabase").collection("mycollection");

//     // Find all documents in the MongoDB collection
//   collection.find().toArray((err, docs) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send("Internal server error");
//     } else {
//       res.send(docs);
//     }
//   });
// });
app.post("/", async (req, res) => {
  try {
    // Create a new user object from request body
    const user = new usermodel({
      name: "dsadsd",
      age: "23",
      // insuranceId:34432,
      // insuranceType:'vehicle'
      User_type: "Employee",
      Address: "dshsdaksuhdjksdnkjsadkshndksj",
    });

    // Save the new user to the database
    await user.save();

    // Send the newly created user object in the response
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const olduser = await usermodel.findOne({
    username,
  });

  if (!olduser) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const NodeUserData = new usermodel({
        ...req.body,
        password: hashPassword,
      });

      var result = await NodeUserData.save();

      if (result) {
        console.log(result);
      } else {
        ("data not saved");
      }
    } catch (error) {
      console.log(error);
    }

    res.send({ status: "new user created" });
  } else {
    res.json({ status: "user already exists" });
  }
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await usermodel.findOne({
    username,
  });

  if (!user) {
    // console.log(req.body);

    res.send({ status: "failed", message: "User not found" });
  } else {
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      res.send({ status: "failed", message: "Incorrect password" });
    } else {
      jwt.sign({ user }, secretKey, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          res.json({
            status: "failed",
            message: "something went wrong in jwt",
          });
        } else {
          res.send({
            status: "success",
            message: "Login successful",
            token: token,
          });
        }
      });
    }

    // console.log(req.body);
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
