import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) return setErro("Preencha email e senha");

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        setErro("");
        if (onLogin) onLogin(data); // atualiza estado no App
        setEmail("");
        setSenha("");
      } else {
        // Ajuste aqui: a API envia { message: "Email ou senha inválidos" }
        setErro(data.message || "Erro no login");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro de conexão com o servidor");
    }
  };

  return (
    <Box maxW="400px" w="full" p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading size="lg" mb={6} textAlign="center" color="teal.500">
        Login
      </Heading>

      <form onSubmit={handleLogin}>
        <VStack spacing={4}>
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

          {erro && <Text color="red.500">{erro}</Text>}

          <Button type="submit" colorScheme="blue" w="full">
            Entrar
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default Login;
