const mongoose = require("mongoose");
const usermodel = require("./usermodel");

const chatSchema = new mongoose.Schema({
    // messageID: { type: String, required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: usermodel },
    sender_name: { type: String},
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: usermodel },
    receiver_name: { type: String },
    message: { type: String},
    // date: { type: String, required: true },
    messaged_time: { type: Date, default: Date.now },
  });

module.exports = mongoose.model("Chatmodel", chatSchema);