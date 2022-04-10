import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { parse, stringify, Selector, SelectorType } from "css-what";
import { Layout } from "../../components/layout";

interface Specificity {
  id: number;
  attr: number;
  el: number;
}

const plusSpecificity = (specificity: Specificity, additionalSpecificity: Specificity) => {
  specificity.id += additionalSpecificity.id;
  specificity.attr += additionalSpecificity.attr;
  specificity.el += additionalSpecificity.el;
};

const topSpecificity = (specificities: Specificity[]) => specificities.reduce((l, r) =>
  l.id !== r.id
    ? (l.id > r.id ? l : r)
  : l.attr !== r.attr
    ? (l.attr > r.attr ? l : r)
  : (l.el > r.el ? l : r)
);

const toSpecificity = (tokens: Selector[]): Specificity => {
  const specificity: Specificity = {
    id: 0,
    attr: 0,
    el: 0,
  };
  for(const token of tokens) {
    switch(token.type) {
      case SelectorType.Attribute:
        if(token.name === "id" && token.ignoreCase === "quirks") {
          specificity.id++;
        } else {
          specificity.attr++;
        }
        break;
      case SelectorType.Pseudo:
        switch(token.name) {
          case "has":
          case "matches":
          case "is":
          case "not":
            if(Array.isArray(token.data)) {
              const subSpecificity = topSpecificity(token.data.map(toSpecificity));
              plusSpecificity(specificity, subSpecificity);
            }
            break;
          case "where":
            break;
          default:
            specificity.attr++;
        }
        break;
      case SelectorType.Tag:
      case SelectorType.PseudoElement:
        specificity.el++;
        break;
    }
  }
  return specificity;
};

const CSSSelectorSpecificity = () => {
  const [selector, setSelector] = useState("");

  const parsedSelector = (() => {
    try {
      return parse(selector);
    } catch(e) {
      return null;
    }
  })();

  return (
    <Box my="16">
      <FormControl
        isInvalid={parsedSelector == null}
        onBlur={() => {
          if(parsedSelector != null) {
            setSelector(stringify(parsedSelector));
          }
        }}
      >
        <FormLabel>selector</FormLabel>
        <Input
          value={selector}
          onChange={e => setSelector(e.target.value)}
          errorBorderColor="red.500"
        />
      </FormControl>
      {parsedSelector && (
        <StatGroup>
          {parsedSelector.map((tokens, i) => {
            const specificity = toSpecificity(tokens);
            return (
              <Stat key={i} p="8">
                <StatLabel>{stringify([tokens])}</StatLabel>
                <StatNumber>
                  {specificity.id}
                  ,
                  {specificity.attr}
                  ,
                  {specificity.el}
                </StatNumber>
              </Stat>
            );
          })}
        </StatGroup>
      )}
    </Box>
  );
};

export default function CSSSelectorSpecificityPage() {
  return (
    <Layout>
      <Head>
        <title>CSS selector specificity</title>
      </Head>
      <CSSSelectorSpecificity />
    </Layout>
  );
}
