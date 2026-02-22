import { useEffect, useState } from "react";
import { withdrawFunds, getTransactions } from "../api/api";

export default function WalletPage() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    });

    if (!res.ok) {
      setTransactions([]);
      return;
    }

    const user = await res.json();
    setBalance(user.walletBalance || 0);

    const tx = await getTransactions();

    if (Array.isArray(tx)) {
      setTransactions(tx);
    } else {
      setTransactions([]);
    }
  } catch (err) {
    setTransactions([]);
  }
};

  const handleWithdraw = async () => {
    const res = await withdrawFunds();
    alert(res.message);
    loadData();
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h2 style={{ marginBottom: "20px" }}>💰 My Wallet</h2>

      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#1e40af)",
          color: "white",
          padding: "30px",
          borderRadius: "15px",
          marginBottom: "40px",
        }}
      >
        <h3>Available Balance</h3>
        <h1 style={{ fontSize: "40px", margin: "10px 0" }}>
          ₹ {balance}
        </h1>

        {balance > 0 && (
          <button
            style={{
              background: "white",
              color: "#1e40af",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleWithdraw}
          >
            Withdraw to Bank
          </button>
        )}
      </div>

      <h3 style={{ marginBottom: "15px" }}>Transaction History</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead style={{ background: "#f3f4f6" }}>
          <tr>
            <th style={{ padding: "12px" }}>Type</th>
            <th style={{ padding: "12px" }}>Task</th>
            <th style={{ padding: "12px" }}>Amount</th>
            <th style={{ padding: "12px" }}>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} style={{ textAlign: "center" }}>
              <td style={{ padding: "12px" }}>{tx.type}</td>
              <td style={{ padding: "12px" }}>
                {tx.task?.title || "-"}
              </td>
              <td style={{ padding: "12px" }}>₹ {tx.amount}</td>
              <td style={{ padding: "12px" }}>
                {new Date(tx.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}