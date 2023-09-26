const claimSchema = new mongoose.Schema({
    claim_id: { type: String, required: true },
    user_id: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
  });
  
  const underwritingSchema = new mongoose.Schema({
    riskLevel: { type: String, required: true },
    riskDescription: { type: String, required: true },
  });
  
  const PaymentSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    claim_id: { type: String, required: true },
    payment_method: { type: String, required: true },
    payment_amount: { type: String, required: true },
    payment_date: { type: String, required: true },
  });
  
  const chatSchema = new mongoose.Schema({
    messageID: { type: String, required: true },
    user_id: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  });
  
  const analysisSchema = new mongoose.Schema({
    analysis_id: { type: String, required: true },
  });


  const policySchema = new mongoose.Schema({
    Policy_Holder_Name: {
      type: String,
      required: true,
    },
    Date_Of_Birth: {
      type: Date,
      required: true,
    },
    Phone_Number: {
      type: Number,
      required: true,
    },
    Email_Address: {
      type: String,
      required: true,
    },
    Policy_Code: {
      type: String,
      required: true,
    },
    Policy_Details: {
      type: String,
      required: true,
    },
    premium_amount: {
      type: String,
      required: true,
    },
    Payment_Method: {
      type: String,
      required: true,
    },
  });
  
  module.exports = mongoose.model("Policy_Model", userSchema);
  
  