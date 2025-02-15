const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../server");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

chai.use(chaiHttp);

describe("Transaction API", () => {
  let transactionId;
  before(async () => {
    await Transaction.deleteMany({});
  });

  it("should fetch all transactions", async () => {
    const res = await chai.request(app).get("/api/transactions");
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("transactions").that.is.an("array");
  });

  it("should add a new transaction", async () => {
    const transactionData = {
      name: "kiru",
      tokenNumber: 22,
      status: "Pending",
      data: { Invoice: true, Receipt: false, Form: true },
    };

    const res = await chai.request(app).post("/api/transactions").send(transactionData);
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("message", "Transaction added");

    const transactions = await Transaction.find();
    expect(transactions).to.have.lengthOf(1);
    transactionId = transactions[0]._id;
  });

  it("should update an existing transaction", async () => {
    const updatedData = { status: "Completed" };
    const res = await chai.request(app).put(`/api/transactions/${transactionId}`).send(updatedData);
    
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Transaction updated");
    expect(res.body.transaction.status).to.equal("Completed");
  });

  it("should delete a transaction", async () => {
    const res = await chai.request(app).delete(`/api/transactions/${transactionId}`);
    
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Transaction deleted");

    const transactions = await Transaction.findById(transactionId);
    expect(transactions).to.be.null;
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
