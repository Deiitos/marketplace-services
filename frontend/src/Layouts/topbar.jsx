import { Box, Flex, Text, Menu, MenuButton, MenuList, MenuItem, Avatar } from "@chakra-ui/react";

function Layout({ usuario, onLogout, mudarPagina, children }) {
  return (
    <Flex direction="column" minH="100vh" w="100%">
      <Flex
        as="header"
        bg="teal.500"
        color="white"
        px={6}
        py={4}
        align="center"
        justify="space-between"
        w="100%"
        position="fixed"
        top={0}
        left={0}
        zIndex={1000}
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
            <MenuButton>
              <Avatar size="sm" name={usuario?.nome} bg="cyan.100" cursor="pointer" />
            </MenuButton>
            <MenuList bg="teal.700">
              <MenuItem bg="teal.700" onClick={() => mudarPagina("perfil")}>
                Perfil
              </MenuItem>
              <MenuItem bg="teal.700" onClick={onLogout}>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Box h="60px" />
      <Box flex={1} w="100%">
        {children}
      </Box>
    </Flex>
  );
}

export default Layout;
