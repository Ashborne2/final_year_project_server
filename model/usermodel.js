const mongoose = require("mongoose");

// Define a schema for the User model

const userSchema = new mongoose.Schema({
  fName: { type: String },
  lName: { type: String  },
  dob: { type: String  },
  email: { type: String},
  username: {type: String},
  password: { type: String },
  phone: { type: String },

  //   insuranceId: { type: String, required: true },
  //   insuranceType: { type: String, required: true },
  userType: { type: String },
  address: { type: String  },
  nin: { type: String }, //national insurance number
});


module.exports = mongoose.model("usermodel", userSchema);

