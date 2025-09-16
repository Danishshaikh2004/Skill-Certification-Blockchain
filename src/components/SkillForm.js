import React, { useState } from "react";
import axios from "axios";

export default function SkillForm({ account, contract }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");
  const [loading, setLoading] = useState(false);

  const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
  const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;

  async function uploadToPinata() {
    if (!file) throw new Error("Select a file first");
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY)
      throw new Error("Missing Pinata keys");

    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const data = new FormData();
    data.append("file", file);

    const res = await axios.post(url, data, {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    return res.data.IpfsHash;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!account) return alert("Connect wallet first");
    if (!contract) return alert("Contract not ready");
    if (!file) return alert("Select a file");

    try {
      setLoading(true);

      // Upload file to Pinata
      const ipfsHash = await uploadToPinata();
      console.log("IPFS hash ready:", ipfsHash);

      // Estimate gas
      const gas = await contract.methods
        .addSkill(name, desc, ipfsHash)
        .estimateGas({ from: account });

      // Send transaction
      const tx = await contract.methods
        .addSkill(name, desc, ipfsHash)
        .send({ from: account, gas });

      console.log("Transaction confirmed:", tx);

      setCid(ipfsHash);
      alert("✅ Uploaded & stored on-chain!");

      setName("");
      setDesc("");
      setFile(null);
    } catch (err) {
      console.error("Upload/transaction failed:", err);
      alert("Upload/transaction failed. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <h2 style={styles.h2}>Submit a Certificate</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Skill name (e.g., React)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Short description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <input
          style={styles.file}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload & Register"}
        </button>
      </form>

      {cid && (
        <div style={styles.cidBox}>
          <div><strong>IPFS Hash (CID):</strong></div>
          <code>{cid}</code>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { marginTop: 8, marginBottom: 28 },
  h2: { margin: "6px 0 10px" },
  form: { display: "grid", gap: 10, gridTemplateColumns: "1fr" },
  input: {
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    outline: "none",
  },
  file: { padding: 8 },
  btn: {
    padding: "10px 14px",
    background: "#0a84ff",
    color: "#fff",
    border: 0,
    borderRadius: 10,
    cursor: "pointer",
  },
  cidBox: {
    marginTop: 10,
    background: "#f2f4f7",
    padding: 10,
    borderRadius: 10,
    wordBreak: "break-all",
    fontSize: 13,
  },
};
