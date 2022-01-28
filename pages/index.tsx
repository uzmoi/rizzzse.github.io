import { Avatar, Center, Text } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Head from "next/head";
import gravatar from "gravatar";
import { Layout } from "../components/layout";

interface Props {
  icon: string;
}

export const getStaticProps: GetStaticProps<Props> = () => {
  return {
    props: {
      icon: gravatar.url("rizzzse@gmail.com", {
        size: "200",
        default: "404",
      }, true),
    },
  };
};

export default function IndexPage({ icon }: Props) {
  return (
    <Layout>
      <Head>
        <title>rizzzse</title>
      </Head>
      <Center my={16}>
        <Avatar size="2xl" name="rizzzse" src={icon} showBorder />
        <Text fontSize="4xl" m={8}>rizzzse</Text>
      </Center>
    </Layout>
  );
}
