import { Center, Stack, StackDivider, Text } from "@chakra-ui/react";
import Head from "next/head";
import { Layout } from "../components/layout";

export default function NotFoundPage() {
  return (
    <Layout>
      <Head>
        <title>Page not found</title>
      </Head>
      <Center>
        <Stack
          align="center"
          direction={["column", "row"]}
          divider={<StackDivider />}
          spacing={8}
          my={16}
        >
          <Text fontSize="7xl">404</Text>
          <Text fontSize="xl">ページが見つかりません</Text>
        </Stack>
      </Center>
    </Layout>
  );
}
