import { useState, useEffect } from "react";
import { Box, VStack, HStack, Heading, Button, Text } from "@chakra-ui/react";
import Loginn from "./Pages/Loginn.jsx";
import Cadastro from "./Pages/Cadastro.jsx";
import Prestadores from "./Pages/Prestadores.jsx";
import Perfil from "./Pages/Perfil.jsx";
import PerfilPrestador from "./Pages/PerfilPrestador.jsx"; // ✅ nova página
import Layout from "./Layouts/topbar.jsx";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [modo, setModo] = useState("login"); // login ou cadastro
  const [pagina, setPagina] = useState("prestadores"); // controla página logada
  const [prestadorSelecionado, setPrestadorSelecionado] = useState(null); // ✅ novo estado
  const [prestadores, setPrestadores] = useState([]); // lista de prestadores

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");
    if (usuarioStorage) setUsuarioLogado(JSON.parse(usuarioStorage));
  }, []);

  const handleCadastro = (novoUsuario) => {
    setUsuarios([...usuarios, novoUsuario]);
    setModo("login");
  };

  const handleLogin = (usuario) => {
    setUsuarioLogado(usuario);
    localStorage.setItem("usuario", JSON.stringify(usuario));
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem("usuario");
    setPagina("prestadores");
  };

  const abrirPerfilPrestador = (prestador) => {
    setPrestadorSelecionado(prestador);
    setPagina("perfilPrestador");
  };

  // ✅ função para atualizar média na lista de prestadores
  const atualizarMediaPrestador = (id, novaMedia) => {
    setPrestadores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, media_avaliacao: novaMedia } : p))
    );
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={6}>
      {!usuarioLogado ? (
        <VStack spacing={6} w="full" maxW="sm">
          {modo === "login" ? (
            <>
              <Loginn onLogin={handleLogin} />
              <HStack>
                <Text>Não tem conta?</Text>
                <Button variant="link" colorScheme="teal" onClick={() => setModo("cadastro")}>
                  Cadastre-se
                </Button>
              </HStack>
            </>
          ) : (
            <>
              <Cadastro onCadastro={handleCadastro} />
              <HStack>
                <Text>Já tem conta?</Text>
                <Button variant="link" colorScheme="teal" onClick={() => setModo("login")}>
                  Faça login
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      ) : (
        <Layout usuario={usuarioLogado} onLogout={handleLogout} mudarPagina={(p) => setPagina(p)}>
          {pagina === "prestadores" && (
            <Box w="full" maxW="md" bg="white" p={6} rounded="xl" shadow="md" textAlign="center" m="auto">
              <Heading size="md" mb={4} color="teal.600">Pesquisa de Prestadores</Heading>
              <Prestadores
                key={usuarioLogado?.id || "semUsuario"}
                onAbrirPerfil={abrirPerfilPrestador}
                prestadores={prestadores}
                setPrestadores={setPrestadores}
              />
            </Box>
          )}

          {pagina === "perfil" && usuarioLogado && (
            <Perfil usuario={usuarioLogado} onVoltar={() => setPagina("prestadores")} />
          )}

          {pagina === "perfilPrestador" && prestadorSelecionado && (
            <PerfilPrestador
              prestador={prestadorSelecionado}
              usuario={usuarioLogado}
              onVoltar={() => setPagina("prestadores")}
              onAtualizarMedia={atualizarMediaPrestador} // ✅ envia função para atualizar média
            />
          )}
        </Layout>
      )}
    </Box>
  );
}

export default App;
