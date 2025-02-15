const Transaction = require("../models/Transaction");

const TransactionApi = {
    getTransactions: async (req, res) => {
        try {
            const { page = 1, limit = 10, status } = req.query;
            // console.log(req.query)
            const filter = status ? { status } : {};
            const total = await Transaction.countDocuments(filter);
            const statusCounts = {
                Pending: await Transaction.countDocuments({ status: "Pending" }),
                Completed: await Transaction.countDocuments({ status: "Completed" }),
                Cancelled: await Transaction.countDocuments({ status: "Cancelled" }),
            };
            const transactions = await Transaction.find(filter)
                .limit(parseInt(limit))
                .skip((page - 1) * limit);

            res.json({ transactions, total, statusCounts });
        } catch (error) {
            console.error("Error fetching transactions:", error);
            res.status(500).json({ message: "Server Error" });
        }
    },
    addTransaction: async (req, res) => {
        try {
            const { name, tokenNumber, status, data } = req.body;
            const newTransaction = new Transaction({
                name,
                tokenNumber,
                status,
                data: {
                    Invoice: data.Invoice || false,
                    Receipt: data.Receipt || false,
                    Form: data.Form || false,
                },
            });

            await newTransaction.save();
            res.status(201).json({ message: "Transaction added" });
        } catch (error) {
            res.status(500).json({ message: "Server Error", error });
        }
    },
    deleteTransaction: async (req, res) => {
        try {
            await Transaction.findByIdAndDelete(req.params.id);
            res.json({ message: "Transaction deleted" });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    },
    updateTransaction: async (req, res) => {
        try {
            const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json({ message: "Transaction updated", transaction: updatedTransaction });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    },
};

module.exports = TransactionApi;
