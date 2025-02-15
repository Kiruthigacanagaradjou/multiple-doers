const express = require("express");
const transactionApi = require("../controllers/transactionController");

const router = express.Router();

router.get("/transactions", transactionApi.getTransactions);
router.post("/transactions", transactionApi.addTransaction);
router.delete("/transactions/:id", transactionApi.deleteTransaction);
router.put("/transactions/:id", transactionApi.updateTransaction);

module.exports = router;

