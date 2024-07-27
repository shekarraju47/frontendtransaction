import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./App.css";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const data = await fetch(
      "https://backendtransactions.vercel.app/api/transactions"
    );
    const res = await data.json();
    setTransactions(res);
  };

  // Sort transactions by date and time in descending order
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const handleAddTransaction = () => {
    if (amount !== "") {
      const newTransaction = { description, amount: Number(amount), type };
      axios
        .post(
          "https://backendtransactions.vercel.app/api/transactions",
          newTransaction
        )
        .then((response) => {
          setTransactions([...transactions, response.data]);
          setDescription("");
          setAmount("");
          setType("credit");
          fetchTransactions();
        });
    } else {
      alert("enter valid inputs");
    }
  };

  return (
    <div className="container">
      <h1>Transactions</h1>
      <table className="table">
        <thead>
          <tr className="titles">
            <th>Description</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Date</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="desc">{transaction.description}</td>
              <td className={transaction.type === "credit" ? null : "red"}>
                {transaction.type === "debit" && transaction.amount}
              </td>
              <td className={transaction.type === "credit" ? "green" : null}>
                {transaction.type === "credit" && transaction.amount}
              </td>
              <td>{new Date(transaction.date).toLocaleString()}</td>
              <td className={transaction.type === "credit" ? "green" : "red"}>
                ₹{transaction.balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Popup
        className="addBtn"
        modal
        trigger={<button className="addBtn">Add Transaction</button>}
      >
        {(close) => (
          <div className="form-group logout-popup">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <input
              className="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
            <button onClick={handleAddTransaction}>Add</button>
            <button onClick={close}>x</button>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default App;
