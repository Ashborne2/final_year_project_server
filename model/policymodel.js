const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
    Coverage: { type: String },
    description: { type: String },
    Price: { type: String },
    Duration: { type: String },
    submitted_time: { type: Date, default: Date.now },
    file: { type: String },
  });

module.exports = mongoose.model("Policymodel", policySchema);