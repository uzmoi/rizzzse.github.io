import { Link } from "@chakra-ui/react";
import NextLink from "next/link";

const NextChakraLink: React.FC<{
  children: React.ReactNode;
  href: string;
}> = ({ children, href }) => (
  <NextLink href={href} passHref>
    <Link>{children}</Link>
  </NextLink>
);

export { NextChakraLink as Link }
