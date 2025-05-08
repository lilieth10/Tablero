import React, { useEffect } from "react";
import axios from "axios";
import Board from "./components/Board";

const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL from .env:", API_URL);

function App() {
  useEffect(() => {
    axios
      .get(`${API_URL}/cards`)
      .then((res) => console.log("Cards:", res.data))
      .catch((err) => console.error("Error fetching cards:", err));
  }, []);

  return (
    <div>
      <Board />
    </div>
  );
}

export default App;
