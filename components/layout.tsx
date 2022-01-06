import { Container, Divider, Flex } from "@chakra-ui/react";
import { Header } from "./header";

export const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Flex flexFlow="column" p={8} minH="100vh">
      <Header />
      <Divider />
      <Container as="main" maxW="container.xl">
        {children}
      </Container>
    </Flex>
  );
};
