import React, { useState } from "react";
import Web3 from "web3";
import SkillCertification from "../contracts/SkillCertification.json";

const VerifySkill = () => {
  const [inputValue, setInputValue] = useState(""); // IPFS hash
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);
      setResult(null);

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SkillCertification.networks[networkId];

      if (!deployedNetwork) {
        throw new Error("❌ Contract not deployed to this network");
      }

      const contract = new web3.eth.Contract(
        SkillCertification.abi,
        deployedNetwork.address
      );

      const response = await contract.methods.isGenuine(inputValue).call();

      if (response.exists) {
        setResult(response);
      } else {
        setResult("NOT_FOUND");
      }
    } catch (error) {
      console.error("Verify failed:", error);
      setResult("ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🔍 Verify Skill</h2>
      <input
        type="text"
        placeholder="Enter IPFS Hash"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={styles.input}
      />
      <button
        onClick={handleVerify}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {result && result !== "NOT_FOUND" && result !== "ERROR" && (
        <div style={styles.result}>
          <p><strong>Skill:</strong> {result.name}</p>
          <p><strong>Description:</strong> {result.description}</p>
          <p><strong>Owner:</strong> {result.owner}</p>
          <p style={{ color: "green", fontWeight: "bold" }}>✅ Genuine Certificate Found</p>
        </div>
      )}

      {result === "NOT_FOUND" && (
        <div style={{ ...styles.result, background: "#ffe6e6", border: "1px solid red", color: "darkred" }}>
          ❌ Certificate Not Found (Fake or Not Registered)
        </div>
      )}

      {result === "ERROR" && (
        <div style={{ ...styles.result, background: "#fff3cd", border: "1px solid #ffecb5", color: "#856404" }}>
          ⚠️ Verification failed. Check console.
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    background: "#f9fafb",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "12px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  input: {
    width: "97%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "12px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  result: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "8px",
    background: "#e5f9e7",
    border: "1px solid #10b981",
    fontSize: "14px",
    fontWeight: "500",
    color: "#065f46",
    whiteSpace: "pre-line",
  },
};

export default VerifySkill;
