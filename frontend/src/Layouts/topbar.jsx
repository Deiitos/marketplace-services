import { Box, Flex, Text, Button, VStack, Divider, MenuButton, Avatar, AvatarGroup, HStack, MenuList, MenuItem, Menu } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";


function Layout({ usuario, onLogout, children }) {
  return (
    <Flex direction="column" minH="100vh" w="100%">
      {/* Topbar ocupa 100% da largura */}
      <Flex
        as="header"
        bg="teal.500"
        color="white"
        px={6}
        py={4}
        align="center"
        justify="space-between"
        w="100%"        // garante largura total
        position="fixed" // fixa no topo
        top="0"
        left={0}
        zIndex="1000"
      >
        <Text fontWeight="bold" fontSize="xl">
          MarketPlace Services
        </Text>
        <Flex align="center" gap={2}>
        <Box mr={1}>
              <Text fontSize="lg" fontWeight="bold" color="teal.900" align="right">
                {usuario?.nome}
              </Text>
              <Text fontSize="sm" color="gray.900">
                {usuario?.email || "email@exemplo.com"}
              </Text>
            </Box>

        <Menu>
          <MenuButton mr={4}>
            <Avatar
            size="sm"
            name={"Usuario Teste"}
            src="https://bit.ly/broken-link"
            bg="cyan.100"
            cursor="pointer"
            />
          </MenuButton>
          <MenuList bg="teal.700">
            <MenuItem bg="teal.700" onClick={() => navigate("/perfil")}>Perfil</MenuItem>
            <MenuItem bg="teal.700" onClick={onLogout}>Sair</MenuItem>
          </MenuList> 
        </Menu>
        </Flex>
      </Flex>

      {/* Espaço para não ficar atrás da topbar */}
      <Box h="60px" />
      <Flex flex="1" w="100%">

        {/* Área de conteúdo principal */}
        <Box as="main" flex="1" p={6} bg="white" minH="calc(100vh - 60px)" >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}

export default Layout;
