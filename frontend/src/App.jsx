import { useState } from "react";
import { 
  Box, 
  Button, 
  Text, 
  VStack, 
  Heading, 
  HStack 
} from "@chakra-ui/react";
import Login from "./Pages/Loginn.jsx";
import Cadastro from "./Pages/Cadastro.jsx";
import Prestadores from "./Pages/Prestadores.jsx";
import Layout from "./Layouts/topbar.jsx";
import { getBackendMessage } from "./api";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [modo, setModo] = useState("login");

  const handleCadastro = (novoUsuario) => {
    setUsuarios([...usuarios, novoUsuario]);
    setModo("login");
  };

  const handleLogin = (usuario) => {
    setUsuarioLogado(usuario);
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={6}>
      {!usuarioLogado ? (
        <VStack spacing={6} bg="white" p={8} rounded="xl" shadow="lg" w="full" maxW="sm">
          {modo === "login" ? (
            <>
              <Heading size="xl" color="teal.500" textAlign="center">MarketPlace <br /> Services </Heading>
              <Login usuarios={usuarios} onLogin={handleLogin} />

              <HStack>
                <Text>Não tem conta?</Text>
                <Button 
                  variant="link" 
                  colorScheme="teal" 
                  onClick={() => setModo("cadastro")}
                >
                  Cadastre-se
                </Button>
              </HStack>
            </>
          ) : (
            <>
              <Heading size="xl" color="teal.500" textAlign="center">MarketPlace <br /> Services </Heading>
              <Cadastro onCadastro={handleCadastro} />

              <HStack>
                <Text>Já tem conta?</Text>
                <Button 
                  variant="link" 
                  colorScheme="teal" 
                  onClick={() => setModo("login")}
                >
                  Faça login
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      ) : (
        <Layout usuario={usuarioLogado} onLogout={() => setUsuarioLogado(null)}>
        <VStack spacing={6} bg="white" p={8} rounded="xl" shadow="lg" w="full" maxW="md">
          <Heading size="lg" color="teal.600">
            Bem-vindo, {usuarioLogado.nome}! 🎉
          </Heading>
          <Button colorScheme="red" onClick={() => setUsuarioLogado(null)}>
            Sair
          </Button>
          {/* Lista de prestadores */}
          <Prestadores usuarios={usuarios} />
        </VStack>
        </Layout>
      )}
    </Box>
  );
}

export default App;
