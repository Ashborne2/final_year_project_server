const mongoose = require("mongoose");
const usermodel = require("./usermodel");
const policy = require("./policymodel");

const PaymentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: usermodel },
    username: { type: mongoose.Schema.Types.String, ref: usermodel },
    policy_id: { type: mongoose.Schema.Types.ObjectId, ref: policy },
    policy_name: { type: String},
    policy_duration: { type: String},
    policy_cost: { type: String},

    CHName: { type: String },
    cardno: { type: String },
    Expiration: { type: String },
    CVV: { type: String },
  });

module.exports = mongoose.model("PaymentModel", PaymentSchema);


abcd ={
    CHName: 'Jácint Ármin',
    cardno: '1122322332233433244',
    Expiration: '3/2022',
    CVV: '332'
  }