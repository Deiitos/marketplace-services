import { useEffect, useState } from "react";
import { getBackendMessage } from "./api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getBackendMessage().then(setMessage);
  }, []);

  return (
    <div>
      <h1>Marketplace Services</h1>
      <p>Mensagem do backend: {message}</p>
    </div>
  );
}

export default App;
