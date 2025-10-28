// src/Pages/Prestadores.jsx
import { useState, useEffect } from "react";
import { VStack, Input, Select, Button, Box, Text, Avatar, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Prestadores({ onAbrirPerfil }) {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({ nome: "", cidade: "", especialidade: "", avaliacao: "" });
  const [resultados, setResultados] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const filtrosSalvos = sessionStorage.getItem("filtrosPrestadores");
    const resultadosSalvos = sessionStorage.getItem("resultadosPrestadores");

    if (filtrosSalvos) setFiltros(JSON.parse(filtrosSalvos));

    if (resultadosSalvos) {
      try {
        const dados = JSON.parse(resultadosSalvos);
        setResultados(Array.isArray(dados) ? dados : []);
      } catch {
        setResultados([]);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handlePesquisar = async () => {
    try {
      const params = new URLSearchParams(
        Object.entries(filtros).filter(([_, v]) => v !== "")
      ).toString();

      const res = await fetch(`${API_BASE_URL}api/prestadores?${params}`);
      if (!res.ok) throw new Error("Erro ao buscar prestadores");

      const data = await res.json();
      setResultados(Array.isArray(data) ? data : []);

      sessionStorage.setItem("filtrosPrestadores", JSON.stringify(filtros));
      sessionStorage.setItem("resultadosPrestadores", JSON.stringify(data));
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar prestadores. Tente novamente.");
    }
  };

  // Ajustei a função para atualizar o estado E o sessionStorage 
  // com o novo array de resultados, e usando a propriedade correta 'avaliacao'.
  const atualizarMedia = (prestadorId, novaMedia) => {
    setResultados(prevResultados => {
      // 1. Cria o novo array com a média atualizada
      const novosResultados = prevResultados.map(p =>
        p.id === prestadorId ? { ...p, avaliacao: novaMedia } : p // <- MUDOU AQUI
      );

      // 2. Salva o novo array no sessionStorage
      sessionStorage.setItem("resultadosPrestadores", JSON.stringify(novosResultados));

      // 3. Retorna o novo array para atualizar o estado
      return novosResultados;
    });
  };

  return (
    <VStack spacing={4} w="full" maxW="lg" m="auto" mt={10}>
      <Input name="nome" placeholder="Nome" value={filtros.nome} onChange={handleChange} />
      <Input name="cidade" placeholder="Cidade" value={filtros.cidade} onChange={handleChange} />
      <Select name="especialidade" value={filtros.especialidade} onChange={handleChange}>
        <option value="">Todas as especialidades</option>
        <option value="Eletricista">Eletricista</option>
        <option value="Encanador">Encanador</option>
        <option value="Pintor">Pintor</option>
      </Select>
      <Select name="avaliacao" value={filtros.avaliacao} onChange={handleChange}>
        <option value="">Todas as avaliações</option>
        <option value="1">1 estrela ou mais</option>
        <option value="2">2 estrelas ou mais</option>
        <option value="3">3 estrelas ou mais</option>
        <option value="4">4 estrelas ou mais</option>
        <option value="5">5 estrelas</option>
      </Select>

      <Button colorScheme="teal" onClick={handlePesquisar}>Pesquisar</Button>

      {resultados.length === 0 ? (
        <Text>Nenhum prestador encontrado.</Text>
      ) : (
        resultados.map((p) => (
          <Box key={p.id} p={4} w="full" bg="white" shadow="md" rounded="md" cursor="pointer"
            onClick={() => {
              sessionStorage.setItem("filtrosPrestadores", JSON.stringify(filtros));
              sessionStorage.setItem("resultadosPrestadores", JSON.stringify(resultados));

              onAbrirPerfil ? onAbrirPerfil(p, atualizarMedia) : navigate(`/usuario/${p.id}`);
            }}
          >
            <Avatar src={p.foto} size="md" mb={2} />
            <Heading size="sm">{p.nome}</Heading>
            <Text>{p.cidade}</Text>
            <Text>{p.especialidade}</Text>

            {/* 👇 CORREÇÃO PRINCIPAL AQUI */}
            <Text color="yellow.500">⭐ {p.avaliacao || 0}</Text>
          </Box>
        ))
      )}
    </VStack>
  );
}

export default Prestadores;