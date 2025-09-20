import { useEffect, useState } from "react";
import { getBackendMessage } from "./api";

function App() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pegar a mensagem do backend usando sua função do api.js
  useEffect(() => {
    getBackendMessage()
      .then(setMessage)
  }, []);

  // Pegar dados do backend diretamente usando import.meta.env.VITE_API_URL
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_URL) {
      setError("VITE_API_URL não definida");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/rota`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados do backend");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando dados do backend...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Marketplace Services</h1>
      <p>Mensagem do backend: {message}</p>
      <h2>Dados do backend:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
