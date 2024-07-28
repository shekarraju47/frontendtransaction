import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./App.css";
import { TailSpin } from "react-loader-spinner";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const data = await fetch(
      "https://backendtransactions.vercel.app/api/transactions"
    );
    const res = await data.json();
    setLoading(false);
    setTransactions(res);
  };

  // Sort transactions by date and time in descending order
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date.getDate) - new Date(a.date)
  );

  const date = sortedTransactions.map((item) => {
    const dateTime = new Date(item.date);
    const date = dateTime.getDate();
    const month = dateTime.getMonth();
    const year = dateTime.getFullYear();
    const fulldate = date + "/" + month + "/" + year;
    const fulldateOf = {
      date: fulldate,
      item,
    };
    return fulldateOf;
  });

  const handleAddTransaction = () => {
    setLoading(true);
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
      setLoading(false);
    } else {
      alert("enter valid inputs");
    }
  };

  const selectItem = (id) => {
    setLoading(true);
    axios
      .delete("https://backendtransactions.vercel.app/api/transactions", {
        params: id,
      })
      .then((response) => {})
      .catch("error");
    setLoading(false);
    fetchTransactions();
  };

  return (
    <div className="container">
      <h1>Transactions</h1>
      {loading ? (
        <div className="loader" testid="loader">
          <TailSpin type="TailSpin" color="#D81F26" height={50} width={50} />
        </div>
      ) : (
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
            {date.map((transaction) => (
              <tr key={transaction.item._id}>
                <td className="desc">
                  {transaction.item.description}
                  <button
                    className="del-icon"
                    onClick={() => selectItem(transaction.item._id)}
                  >
                    <img
                      src="https://www.clipartmax.com/png/small/242-2428212_png-file-delete-icon-png-small.png"
                      alt=""
                    />
                  </button>
                </td>

                <td
                  className={transaction.item.type === "credit" ? null : "red"}
                >
                  {transaction.item.type === "debit" && transaction.item.amount}
                </td>
                <td
                  className={
                    transaction.item.type === "credit" ? "green" : null
                  }
                >
                  {transaction.item.type === "credit" &&
                    transaction.item.amount}
                </td>
                <td>{transaction.date}</td>
                <td
                  className={
                    transaction.item.type === "credit" ? "green" : "red"
                  }
                >
                  ₹{transaction.item.balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
            <button className="pop-up-add" onClick={handleAddTransaction}>
              Add
            </button>
            <button className="close-btn" onClick={close}>
              x
            </button>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default App;
