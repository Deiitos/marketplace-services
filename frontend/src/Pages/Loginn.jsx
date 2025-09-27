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

function Login({ usuarios, onLogin }) {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const usuario = usuarios.find(
      (u) => u.nome === nome && u.senha === senha
    );

    if (usuario) {
      setErro("");
      onLogin(usuario);
    } else {
      setErro("Usuário ou senha incorretos!");
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
            <FormLabel>Nome de usuário</FormLabel>
            <Input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
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
