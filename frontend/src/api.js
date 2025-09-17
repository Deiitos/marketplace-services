const API_URL = import.meta.env.VITE_API_URL;

export async function getBackendMessage() {
  const res = await fetch(`${API_URL}/`);
  return res.text();
}
