import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Find the <div id="root"> from index.html and tell React to control it
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render our App component inside that root
root.render(<App />);