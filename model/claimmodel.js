const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
    claim_id: { type: String, required: true },
    user_id: { type: String, required: true },
    Broker_id: { type: String, required: true },
    Insurance_id: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    file: { type: String, required: true },
    
  });

module.exports = mongoose.model("Claimmodel", claimSchema);