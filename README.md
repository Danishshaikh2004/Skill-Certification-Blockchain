# 🎓 Skill Certification DApp

## Overview
The **Skill Certification DApp** is a decentralized application (DApp) designed to upload, verify, and manage skill certifications securely using **Blockchain Technology**.  
It leverages the **Ethereum blockchain** for tamper-proof verification, **MetaMask** for wallet integration, and stores certification details on-chain.  
Built with **React.js (Vite)**, **Solidity**, and **CSS**, this project ensures trust, transparency, and security in validating skills and credentials.

---

## 🚀 Features
- **Decentralized Verification:** Skill certifications are stored on blockchain for transparency and security.  
- **MetaMask Integration:** Users connect their Ethereum wallets to upload and verify certifications.  
- **Smart Contract Powered:** Certification data is validated using Solidity contracts.  
- **User Roles:**  
  - **Users** → Upload certifications.  
  - **Verifiers** → Validate and approve uploaded certifications.  
- **Interactive UI:** Built with React.js (Vite) + CSS for a seamless user experience.  

---

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite), JavaScript, CSS  
- **Smart Contracts:** Solidity  
- **Blockchain Network:** Ethereum (Sepolia / Testnet)  
- **Wallet Integration:** MetaMask  
- **Tools:** Hardhat / Remix, Node.js, NPM  

---

## 📋 Prerequisites
Ensure the following are installed on your system:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)  
- [MetaMask](https://metamask.io/) (Browser Extension)  
- Ethereum Testnet (Sepolia recommended, with test ETH)  
- Hardhat / Remix IDE for smart contract deployment  

---

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/skill-certification-dapp.git
cd skill-certification-dapp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables   

Create a .env file in the root folder and add:
```bash
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_CONTRACT_ABI=your_contract_abi_json
```

Replace your_deployed_contract_address with the contract address after deployment.

Replace your_contract_abi_json with the ABI JSON from your smart contract.

### 4. Deploy Smart Contract

Write/compile your Solidity contract in Remix IDE or Hardhat.

Deploy it to the Sepolia Testnet (or Ganache for local testing).

Copy the contract address and ABI → paste into .env as shown above.

### 5. Start the Application
```bash
npm run dev
```


Open your browser at:
```bash
http://localhost:5173
```
