import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
} from "@chakra-ui/react";

function Cadastro({ onCadastro }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [prestador, setPrestador] = useState(false);
  const [especialidade, setEspecialidade] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !email || !senha) return;

    const usuario = { nome, email, senha, prestador, especialidade };

    try {
      const res = await fetch("http://localhost:5000/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      const data = await res.json();
      if (res.ok) {
        // callback para atualizar estado no App
        if (onCadastro) onCadastro(data);
        setNome("");
        setEmail("");
        setSenha("");
        setPrestador(false);
        setEspecialidade("");
      } else {
        console.error(data.error || "Erro ao cadastrar usuário");
      }
    } catch (err) {
      console.error("Erro de conexão com o servidor", err);
    }
  };

  return (
    <Box maxW="400px" w="full" p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading size="lg" mb={6} textAlign="center" color="teal.500">
        Cadastro
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nome de usuário</FormLabel>
            <Input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Senha</FormLabel>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              <input
                type="checkbox"
                checked={prestador}
                onChange={(e) => setPrestador(e.target.checked)}
              />{" "}
              Sou prestador de serviço
            </FormLabel>
            {prestador && (
              <Select
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                placeholder="Selecione"
              >
                <option value="eletricista">Eletricista</option>
                <option value="encanador">Encanador</option>
                <option value="pintor">Pintor</option>
                <option value="pedreiro">Pedreiro</option>
                <option value="jardineiro">Jardineiro</option>
              </Select>
            )}
          </FormControl>

          <Button type="submit" colorScheme="blue" w="full">
            Cadastrar
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default Cadastro;
