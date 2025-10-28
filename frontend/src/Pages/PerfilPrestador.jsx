// src/Pages/PerfilPrestador.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box, Link, Avatar, Heading, Text, VStack, HStack, Button, Divider, Center, Spinner,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  useDisclosure, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Textarea,
} from "@chakra-ui/react";

function PerfilPrestador({ prestador: prestadorProp, usuario, onVoltar, onAtualizarMedia }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prestador, setPrestador] = useState(prestadorProp || null);
  const [loading, setLoading] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  // Buscar prestador
  useEffect(() => {
    if (prestadorProp) {
      setPrestador(prestadorProp);
      return;
    }
    if (!id) return;

    const fetchPrestador = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}api/usuario/${id}`);
        if (!res.ok) throw new Error("Erro ao carregar prestador");
        const data = await res.json();
        setPrestador(data);
      } catch (err) {
        console.error("Erro ao carregar prestador:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestador();
  }, [prestadorProp, id]);

  // Buscar avaliações e média
  const fetchAvaliacoesEMedia = async (usuarioId) => {
    try {
      // Avaliações
      const resAval = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}/avaliacoes`);
      const dataAval = await resAval.json();
      setAvaliacoes(Array.isArray(dataAval) ? dataAval : []);

      // Média
      const resMedia = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}/avaliacoes/media`);
      const dataMedia = await resMedia.json();
      setPrestador((prev) => ({ ...prev, media_avaliacao: dataMedia.media || 0 }));
    } catch (err) {
      console.error("Erro ao buscar avaliações ou média:", err);
      setAvaliacoes([]);
    }
  };

  useEffect(() => {
    if (!prestador) return;
    fetchAvaliacoesEMedia(prestador.id);
  }, [prestador]);

  const handleVoltar = () => {
    if (typeof onVoltar === "function") {
      onVoltar();
      return;
    }
    navigate(-1);
  };

  // Enviar avaliação
  const handleSubmitAvaliacao = async () => {
    if (!usuario || !usuario.id) {
      alert("Você precisa estar logado para avaliar");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/avaliacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: prestador.id, // ⚠️ deve ser 'usuario_id'
          avaliador_id: usuario.id,
          nota,
          comentario,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Atualiza avaliações localmente
        setAvaliacoes((prev) => [data, ...prev]);

        // Atualiza média chamando backend novamente
        fetchAvaliacoesEMedia(prestador.id);

        // Atualiza média na lista de Prestadores do App, se função existir
        if (typeof onAtualizarMedia === "function") {
          onAtualizarMedia(prestador.id, data.novaMedia || nota);
        }

        onClose();
        setComentario("");
        setNota(5);
        alert("Avaliação enviada!");
      } else {
        alert(data.error || "Erro ao enviar avaliação");
      }
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      alert("Erro ao enviar avaliação");
    }
  };

  if (loading || !prestador) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <VStack spacing={4} p={6} w="full" maxW="md" m="auto" mt={10}>
      <Button alignSelf="flex-start" onClick={handleVoltar} colorScheme="gray">← Voltar</Button>
      <Avatar size="xl" name={prestador.nome} src={prestador.foto || ""} />
      <Heading size="lg">{prestador.nome}</Heading>
      <Text color="yellow.500">⭐ {prestador.media_avaliacao || 0}</Text>
      <Divider />

      <Box w="full" textAlign="left">
        <Text><strong>Especialidade:</strong> {prestador.especialidade || "Não informada"}</Text>
        <Text><strong>Cidade:</strong> {prestador.cidade || "Não informada"}</Text>
        <Text><strong>Descrição:</strong> {prestador.descricao || "Sem descrição"}</Text>
      </Box>
      <Divider />

        <Box w="full" textAlign="left">
            <Text>
            <strong>LinkedIn: </strong>
                {prestador.linkedin ? (
            <Link href={prestador.linkedin} isExternal color="teal.500">
            {prestador.linkedin}
            </Link>
    ) : (
      "—"
    )}
            </Text>
            <Text>
            <strong>Instagram: </strong>
                {prestador.instagram ? (
            <Link href={prestador.instagram} isExternal color="teal.500">
            {prestador.instagram}
            </Link>
    ) : (
      "—"
    )}
            </Text>
            <Text>
            <strong>Facebook: </strong>
                {prestador.facebook ? (
            <Link href={prestador.facebook} isExternal color="teal.500">
            {prestador.facebook}
            </Link>
    ) : (
      "—"
    )}
            </Text>
</Box>
      <Divider />

      <Button colorScheme="teal" onClick={onOpen}>Avaliar</Button>

      {/* Modal Avaliação */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Avaliar Prestador</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <NumberInput
              max={5}
              min={1}
              value={nota}
              onChange={(value) => setNota(Number(value))}
              mb={3}
            >
              <NumberInputField placeholder="Nota de 1 a 5" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Textarea
              placeholder="Comentário (opcional)"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmitAvaliacao}>Enviar</Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Divider />
      <Box w="full">
        <Heading size="md" mb={3}>Avaliações</Heading>
        {avaliacoes.length === 0 ? (
          <Text textAlign="center">Nenhuma avaliação ainda.</Text>
        ) : (
          <VStack spacing={3} align="stretch">
            {avaliacoes.map((a) => (
              <Box key={a.id} p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
                <Text fontWeight="bold">{a.nome_avaliador || "Usuário"}</Text>
                <Text>{a.comentario || "—"}</Text>
                <HStack>
                  <Text>Nota:</Text>
                  <Text fontWeight="bold">{a.nota} / 5 ⭐</Text>
                </HStack>
                <Text fontSize="sm" color="gray.500">{new Date(a.data).toLocaleDateString()}</Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </VStack>
  );
}

export default PerfilPrestador;
