const mongoose = require("mongoose");
const usermodel = require("./usermodel");

const purchaseSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: usermodel },
    cardholderName: { type: String },
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvv: { type: String },


});

module.exports = mongoose.model("Purchasemodel", purchaseSchema);