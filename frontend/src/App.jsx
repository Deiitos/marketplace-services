import { useEffect, useState } from "react";
import { getBackendMessage } from "./api";

// function App() {
//   const [message, setMessage] = useState("");
function App() {
  const [data, setData] = useState([]);
  // useEffect(() => {
  //   getBackendMessage().then(setMessage);
  // }, []);
    useEffect(() => {
    getData().then(setData);
  }, []);

  return (
    <div>
      <h1>Marketplace Services</h1>
      <p>Mensagem do backend: {message}</p>
    </div>
  );
}

export default App;
