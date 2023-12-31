const mongoose = require("mongoose");
const usermodel = require("./usermodel");

const claimSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: usermodel },
  username: { type: mongoose.Schema.Types.String, ref: usermodel },
  broker_name: { type: String },
  Insurance_id: { type: String },
  policy_code: { type: String },
  damage_coverage: { type: String },
  location: { type: String },
  date_time: { type: String, },
  submitted_time: { type: Date, default: Date.now },
  description: { type: String },
  file: { type: String },
  Agent_name: { type: String },
  status: { type: String, default: "Pending"}
});

module.exports = mongoose.model("Claimmodel", claimSchema);
