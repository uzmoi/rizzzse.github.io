import { Box, Flex, IconButton, Spacer, Text, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link } from "./link";

export const Header: React.FC<{  }> = ({  }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex as="header" p={2} h={14}>
      <Box>
        <Text fontSize="2xl">
          <Link href="/">rizzzse apps</Link>
        </Text>
      </Box>
      <Spacer />
      <Box>
        <IconButton
          aria-label="dark mode"
          onClick={toggleColorMode}
          icon={{
            light: <MoonIcon />,
            dark: <SunIcon />,
          }[colorMode]}
        />
      </Box>
    </Flex>
  );
};
