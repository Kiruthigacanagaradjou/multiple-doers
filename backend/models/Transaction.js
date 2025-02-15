const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tokenNumber: { type: Number, required: true },
  status: { type: String, required: true },
  data: {
    Invoice: { type: Boolean, default: false },
    Receipt: { type: Boolean, default: false },
    Form: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
