// src/pages/Login.jsx
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tentando login:", { email, senha });
  };

  return (
    <Flex
      height="100vh"
      align="center"
      justify="center"
      bg="gray.100"
    >
      <Box
        bg="white"
        p={8}
        rounded="md"
        shadow="md"
        w="sm"
      >
        <Heading mb={6} textAlign="center">
          Login
        </Heading>

        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </FormControl>

          <FormControl mb={6}>
            <FormLabel>Senha</FormLabel>
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
              required
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
          >
            Entrar
          </Button>
        </form>

        <Text mt={4} textAlign="center" fontSize="sm">
          Não tem conta? <Text as="span" color="blue.500" cursor="pointer">Cadastre-se</Text>
        </Text>
      </Box>
    </Flex>
  );
}
