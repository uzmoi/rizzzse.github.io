import { Avatar, Center, Text } from "@chakra-ui/react";
import Head from "next/head";
import { Layout } from "../components/layout";

export default function IndexPage() {
  return (
    <Layout>
      <Head>
        <title>rizzzse</title>
      </Head>
      <Center my={16}>
        <Avatar size="2xl" name="rizzzse" src="/rizzzse-icon.png" showBorder />
        <Text fontSize="4xl" m={8}>rizzzse</Text>
      </Center>
    </Layout>
  );
}
