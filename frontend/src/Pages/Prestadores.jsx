 function Prestadores({ usuarios }) {
  // Filtra somente quem é prestador
  const prestadores = usuarios.filter((u) => u.prestador);

  return (
    <div>
      <h2>Lista de Prestadores de Serviço</h2>
      <div
        style={{
          maxHeight: "200px", // altura máxima da lista
          overflowY: "auto", // adiciona scroll vertical
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {prestadores.length > 0 ? (
          <table border="1" cellPadding="10" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Especialidade</th>
                <th>Nome</th>
                <th>Avaliação</th>
              </tr>
            </thead>
            <tbody>
              {prestadores.map((p, index) => (
                <tr key={index}>
                  <td>{p.especialidade || "Não informado"}</td>
                  <td>{p.nome}</td>
                  <td>{p.avaliacao || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum prestador cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}

export default Prestadores;
