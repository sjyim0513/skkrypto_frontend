import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import React from "react";
import { ReceiptBalances } from "./components/ReceiptBalances";
import "./App.css";

const RECEIPT_WALLET = "rD1QQCtGkqRuNK6kPssfqokAFziQVhbEQP";

function App() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>SKKRTPYO </h1>
      <h1>Private networking party </h1>
      <ReceiptBalances account={RECEIPT_WALLET} />
    </div>
  );
}

export default App;
