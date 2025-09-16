import React, { useEffect, useState } from "react";
import Web3 from "web3";
import SkillForm from "./components/SkillForm";
import VerifySkill from "./components/VerifySkill.js";
import SkillCertificationABI from "./contracts/SkillCertification.json";

// Prefer MetaMask; fall back to Ganache RPC if not injected
const web3 = new Web3("http://127.0.0.1:7545");

// Put your deployed address in .env as REACT_APP_CONTRACT_ADDRESS
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function loadWeb3AndContract() {
      try {
        if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.trim() === "") {
          console.error("Missing REACT_APP_CONTRACT_ADDRESS in .env");
        }

        // Request accounts
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
        }

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0] || "");

        // Init contract
        const instance = new web3.eth.Contract(
          SkillCertificationABI.abi,
          CONTRACT_ADDRESS
        );
        setContract(instance);
      } catch (err) {
        console.error("Failed to init web3/contract:", err);
        alert("Web3/Contract init failed. Check console.");
      }
    }
    loadWeb3AndContract();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Skill Verification System</h1>
        <p style={styles.sub}>Store & verify certificates by IPFS hash.</p>

        <div style={styles.row}>
          <div style={styles.badge}>
            <strong>Connected:</strong>{" "}
            <span style={{ color: "#0a84ff" }}>
              {account || "No wallet connected"}
            </span>
          </div>
          <div style={styles.badge}>
            <strong>Contract:</strong>{" "}
            <span style={{ color: "#0a84ff" }}>{CONTRACT_ADDRESS || "-"}</span>
          </div>
        </div>

        {/* Submit new certificate (pins to Pinata, then addSkill) */}
        <SkillForm account={account} contract={contract} />

        {/* Verify by IPFS hash (existence + details) */}
        <VerifySkill contract={contract} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 860,
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },
  title: { margin: 0, fontSize: 28 },
  sub: { marginTop: 6, color: "#667085" },
  row: { display: "flex", gap: 12, flexWrap: "wrap", margin: "12px 0 20px" },
  badge: {
    background: "#f2f4f7",
    padding: "8px 12px",
    borderRadius: 10,
    fontSize: 14,
  },
};

export default App;
