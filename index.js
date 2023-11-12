const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("./config/config");
const usermodel = require("./model/usermodel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = "thisismysecretkey";
const Claimmodel = require("./model/claimmodel");
const claimmodel = require("./model/claimmodel");
const chatmodel = require("./model/messages");
const Policymodel = require("./model/policymodel");
const multer  = require('multer')


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static('uploads'));

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
            message: "Logged in successfully",
            token: token,
            user: user,
          });
        }
      });
    }
  }
});


// app.post("/claim", async (req, res) => {

//   const claim = new Claimmodel({
//    ...req.body,
//   });

//  let claimdata = await claim.save();
  

//   if (claimdata) {
//     console.log(claimdata);
//   } else {
//     ("data not saved");
//   }
// });

app.get("/adminClaim", async (req, res) => {

  const claimdata = await Claimmodel.find();

  if (claimdata) {
    res.json({status:"success",message:"data retrieved" ,data:claimdata});
    // console.log();
  } else {
    ("Could not get data");
  }

  
});

app.get("/prClaims/:userID", async (req, res) => {
  let userID = req.params.userID;
  const user = await claimmodel.find({
    user_id: userID,
  });
  if (!user) {
    console.log("claims not found");
  } else {
    res.json({status:"success",message:"claims retrieved" ,data:user});
    // console.log(user);
  }

});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null,uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })



app.post("/claim",upload.single('file') ,async(req, res) =>{
  const claimdata = JSON.parse(req.body.claimdata);
  const claim = new Claimmodel({

    ...claimdata,
    file:'http://192.168.10.196:5000/images/'+req.file.filename,
   });
   let claimSave = await claim.save();
    if(claimSave){
      res.json({status:"success",message:"claim submitted",data:claimSave});
    }else{
      res.json({status:"failed",message:"claim not submitted"});
    }
  
});

app.post("/policy",upload.single('file') ,async (req, res) => {
  
  const policydata = JSON.parse(req.body.policydata);
  const policy = new Policymodel({
    ...policydata,
    file:'http://192.168.10.196:5000/images/'+req.file.filename,
  });
  let policySave = await policy.save();
  if(policySave){
    res.json({status:"success",message:"policy submitted",data:policySave});
  }else{
    res.json({status:"failed",message:"policy not submitted"});
  }

});

app.get("/getpolicy", async (req, res) => {

  const policydata = await Policymodel.find();

  if (policydata) {
    res.json({status:"success",message:"data retrieved" ,data:policydata});
    // console.log();
  } else {
    ("Could not get data");
  }

  
});

app.post("/checkout", async (req, res) => {
  
  
   console.log(req.body);

});


app.listen(5000, () => {
  console.log("Server started on port 5000");
});



