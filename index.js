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
const { PythonShell } = require('python-shell');
const policymodel = require("./model/policymodel");
const Paymentmodel = require("./model/payment");

const modeeelPath = './model.pkl';
// const predict = require('../script/predict.py');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static('uploads'));


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
    res.send({ status: "failed", message: "Wrong Credential. Access Denied" });
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






// get agent user

app.get("/getAgent", async (req, res) => {

  const agent = await usermodel.find({userType:'Agent'});

  if(agent){
    res.json({status:"success",message:"data retrieved" ,data:agent});
  }else{
    res.json({status:"fail"},);
  }

  
});








app.post("/upStatus", async (req, res) => {
  
  let claimId = req.body.id;
  let statUs=  req.body.status;


  const claim = await Claimmodel.findById(claimId);

  if (!claim) {
    res.json({
      status:"fail",message:"claim not found"
    });
  } else {


    let result = await Claimmodel.findByIdAndUpdate(claimId, {
      $set: {
          status:statUs
      }
  });

    if(result){
      res.json({
    status:"success"
  });
    }
  

    

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
  paymentdata = req.body;
  const payment = new Paymentmodel({
    ...paymentdata,
  })
  console.log(payment);
  
  let paymentSave = await payment.save();

});

app.get("/getPayments", async (req, res) => {
  
    const paymentdata = await Paymentmodel.find();
  
    if (paymentdata) {
      res.json({status:"success",message:"data retrieved" ,data:paymentdata});
      // console.log();
    } else {
      res.json({status:"failed",message:"no data found"});
    }

});

app.post("/predict", async (req, res) => { 

const pythonScriptPath = "../script";
const modelPath = modeeelPath;
const formData = {'_id':'',
      'user_id':'',
      'broker_name':'Jane Mackarenel',
      'policy_code':'',
      'damage_coverage':'full coverage',
      'location':'esdreresf',
      'date_time':'',
      'description':'Lorem ipsum dolor sit amet, consectetur adipisicing elit.illo possimus tenetur venia',
      'file':'',
      'submitted_time':'',         
};
const inputData = JSON.stringify(formData);
  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: pythonScriptPath,
    args: [modelPath, inputData],
};
PythonShell.run('predict.py', options, function(err, results) {
    if (err) throw err;
    const prediction = JSON.parse(results[0]);
    console.log('Prediction:', prediction);
});

});

// app.post("/predict", async (req, res) => { 

//   // Specify the path to Python script
// const pythonScriptPath = "../script";

// // Specify the path to your serialized KNN model
// const modelPath = modeeelPath;

// // Form data from React
// const formData = {'_id':'',
//       'user_id':'',
//       'broker_name':'Jane Mackarenel',
//       'policy_code':'',
//       'damage_coverage':'full coverage',
//       'location':'esdreresf',
//       'date_time':'',
//       'description':'Lorem ipsum dolor sit amet, consectetur adipisicing elit.illo possimus tenetur venia',
//       'file':'',
//       'submitted_time':'',         
// };

// // Prepare the data to be passed to the Python script
// const inputData = JSON.stringify(formData);

// // Set up the options for the Python script
//   const options = {
//     mode: 'text',
//     pythonOptions: ['-u'],
//     scriptPath: pythonScriptPath,
//     args: [modelPath, inputData],
// };

// // Run the Python script
// PythonShell.run('predict.py', options, function(err, results) {
//     if (err) throw err;
//     const prediction = JSON.parse(results[0]);
//     console.log('Prediction:', prediction);
// });



// });

app.post("/chat", async (req, res) => {

  const chat = new chatmodel({
    ...req.body,
  });
  let chatSave = await chat.save();
  if(chatSave){
    res.json({status:"success",message:"chat saved",data:chatSave});
  }else{
    res.json({status:"failed",message:"chat not saved"});
  }

});

app.post("/delete/:itemID", async (req, res) => {
  let itemID = req.params.itemID;
  console.log(itemID);
  const item = await Policymodel.findByIdAndDelete(itemID);
  if (!item) {
    console.log("item not found");
    res.json({status:"failed",message:"No such record found"});
  } else {
    res.json({status:"success",message:"Policy Record Deleted"});
    console.log("item deleted");
  }

});

app.post("/edit/:itemID", async (req, res) => {
  let itemID = req.params.itemID;
  console.log(itemID);
  console.log(req.body);
  // modifiedData = JSON.parse(req.body.formData);
  // console.log(modifiedData);  
  const item = await Policymodel.findById(itemID);


  if (!item) {
    console.log("item not found");
    res.json({status:"failed",message:"No such record found"});
  } else {
    // Update the existing item object
    item.set(req.body);
    // Save the updated item
    const updatedItem = await item.save();
    console.log(updatedItem);
    res.json({status:"success",message:"Policy Record Updated",data:updatedItem});
    // console.log(updatedItem);
  }
});

app.get("/getAllUsers", async (req, res) => {
  
    const userdata = await usermodel.find();
  
    if (userdata) {
      res.json({status:"success",message:"data retrieved" ,data:userdata});
      // console.log();
    } else {
      ("Could not get data");
    }

});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});



