import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  Select,
  Text,
} from "@chakra-ui/react";

function Cadastro({ onCadastro }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [prestador, setPrestador] = useState(false);
  const [especialidade, setEspecialidade] = useState("");
  const [cidade, setCidade] = useState("");
  const [erro, setErro] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleCadastro = async (e) => {
    e.preventDefault();

    // Validações
    if (!nome || !email || !senha) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    if (prestador && !cidade) {
      setErro("Prestadores precisam informar a cidade.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha, // o servidor deve gerar o hash
          prestador,
          especialidade: prestador ? especialidade : null,
          cidade: prestador ? cidade : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setErro("");
        alert("Cadastro realizado com sucesso!");
        if (onCadastro) onCadastro(data);
      } else {
        setErro(data.error || "Erro ao cadastrar usuário");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro de conexão com o servidor");
    }
  };

  return (
    <Box maxW="400px" w="full" p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading size="lg" mb={6} textAlign="center" color="teal.500">
        Cadastro
      </Heading>

      <form onSubmit={handleCadastro}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Senha</FormLabel>
            <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </FormControl>

          <FormControl>
            <Checkbox
              isChecked={prestador}
              onChange={(e) => setPrestador(e.target.checked)}
            >
              Quero me cadastrar como prestador
            </Checkbox>
          </FormControl>

          {prestador && (
            <>
              <FormControl isRequired>
                <FormLabel>Cidade</FormLabel>
                <Input value={cidade} onChange={(e) => setCidade(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Especialidade</FormLabel>
                <Select
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                >
                  <option value="">Selecione a especialidade</option>
                  <option value="Eletricista">Eletricista</option>
                  <option value="Encanador">Encanador</option>
                  <option value="Pintor">Pintor</option>
                  <option value="Pedreiro">Pedreiro</option>
                  <option value="Jardineiro">Jardineiro</option>
                </Select>
              </FormControl>
            </>
          )}

          {erro && <Text color="red.500">{erro}</Text>}

          <Button type="submit" colorScheme="teal" w="full">
            Cadastrar
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default Cadastro;
