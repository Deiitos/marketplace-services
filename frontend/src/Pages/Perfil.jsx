import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Avatar,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  VStack,
  HStack,
  Text,
  Divider,
  SimpleGrid,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

function Perfil({ usuario, onVoltar }) {
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados individuais para formulário
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState(0);

  useEffect(() => {
    if (!usuario) return;

    const fetchUsuario = async () => {
      try {
        // Buscar dados completos do usuário logado
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/${usuario.id}`);
        if (!res.ok) throw new Error("Erro ao buscar dados do usuário");
        const data = await res.json();

        setUsuarioData(data);
        setNome(data.nome || "");
        setCidade(data.cidade || "");
        setEspecialidade(data.especialidade || "");
        setDescricao(data.descricao || "");
        setFoto(data.foto || "");
        setLinkedin(data.linkedin || "");
        setInstagram(data.instagram || "");
        setFacebook(data.facebook || "");
        setMediaAvaliacoes(data.avaliacao || 0);

        // Buscar avaliações
        const avalRes = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${usuario.id}/avaliacoes`);
        if (!avalRes.ok) throw new Error("Erro ao buscar avaliações");
        const avalData = await avalRes.json();
        setAvaliacoes(avalData);

        if (avalData.length > 0) {
          const media = (avalData.reduce((acc, cur) => acc + cur.nota, 0) / avalData.length).toFixed(1);
          setMediaAvaliacoes(media);
        }

      } catch (err) {
        console.error(err);
        alert("Erro ao carregar dados do usuário");
      }
      setLoading(false);
    };

    fetchUsuario();
  }, [usuario]);

  const handleSalvar = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          cidade,
          especialidade,
          descricao,
          foto,
          linkedin,
          instagram,
          facebook,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Perfil atualizado com sucesso!");
      } else {
        alert(data.error || "Erro ao atualizar perfil");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor");
    }
    setSaving(false);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoverFoto = () => setFoto("");

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Center minH="calc(100vh - 60px)" bg="gray.50">
      <Box maxW="600px" w="full" p={6} bg="white" borderRadius="lg" shadow="md">
        <VStack spacing={6} align="center">
          <Heading size="lg" color="teal.600">Meu Perfil</Heading>

          {/* Foto */}
          {/* <FormControl>
            <FormLabel>Foto de Perfil</FormLabel>
            <VStack spacing={3}>
              <Avatar size="xl" src={foto} />
              <HStack>
                <Input type="file" accept="image/*" onChange={handleFotoChange} />
                <Button colorScheme="red" onClick={handleRemoverFoto}>Remover</Button>
              </HStack>
            </VStack>
          </FormControl> */}

          {/* Nome */}
          <FormControl>
            <FormLabel>Nome</FormLabel>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </FormControl>

          {/* Cidade */}
          <FormControl>
            <FormLabel>Cidade</FormLabel>
            <Input value={cidade} onChange={(e) => setCidade(e.target.value)} />
          </FormControl>

          {/* Especialidade */}
          <FormControl>
            <FormLabel>Especialidade</FormLabel>
            <Select value={especialidade} onChange={(e) => setEspecialidade(e.target.value)}>
              <option value="">Selecione</option>
              <option value="Eletricista">Eletricista</option>
              <option value="Encanador">Encanador</option>
              <option value="Pintor">Pintor</option>
              <option value="Pedreiro">Pedreiro</option>
              <option value="jardineiro">Jardineiro</option>
            </Select>
          </FormControl>

          {/* Descrição */}
          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Fale um pouco sobre você..."
            />
          </FormControl>

          {/* Redes Sociais */}
          <FormControl>
            <FormLabel>LinkedIn</FormLabel>
            <Input type="url" placeholder="https://www.linkedin.com/in/usuario" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Instagram</FormLabel>
            <Input type="url" placeholder="https://www.instagram.com/usuario" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Facebook</FormLabel>
            <Input type="url" placeholder="https://www.facebook.com/usuario" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
          </FormControl>

          {/* Média de Avaliações */}
          <FormControl>
            <FormLabel>Média de Avaliações</FormLabel>
            <HStack>
              <Text fontSize="xl" fontWeight="bold">{mediaAvaliacoes} / 5</Text>
              <FaStar color="gold" />
            </HStack>
          </FormControl>

          {/* Botões */}
          <HStack spacing={4}>
            <Button colorScheme="teal" onClick={handleSalvar} isLoading={saving}>
              Salvar Alterações
            </Button>
            <Button variant="outline" onClick={onVoltar}>Voltar para Prestadores</Button>
          </HStack>

          <Divider />

          {/* Avaliações */}
          <Box w="full">
            <Heading size="md" mb={3}>Avaliações</Heading>
            {avaliacoes.length === 0 ? (
              <Text textAlign="center">Nenhuma avaliação ainda.</Text>
            ) : (
              <SimpleGrid columns={1} spacing={3}>
                {avaliacoes.map((a, index) => (
                  <Box key={index} p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
                    <Text fontWeight="bold">{a.nome_usuario}</Text>
                    <Text>{a.comentario}</Text>
                    <HStack>
                      <Text>Nota:</Text>
                      <Text fontWeight="bold">{a.nota} / 5 ⭐</Text>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </VStack>
      </Box>
    </Center>
  );
}

export default Perfil;
