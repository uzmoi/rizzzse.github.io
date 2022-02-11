import { Box, BoxProps } from "@chakra-ui/react";

export const PosCenter: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      pos="absolute"
      {...props}
      top="50%"
      left="50%"
      transform="translate(-50%,-50%)"
    >
      {children}
    </Box>
  );
};
