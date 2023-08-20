import type { NextPage } from "next";
import Link from "next/link";

import { theme } from "./_app";
import {
  useColorModeValue,
  ColorModeScript,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import Layout from "~/components/layout";

const Custom404: NextPage = () => {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");
  const red = useColorModeValue("brand.light.red", "brand.dark.red");

  return (
    <Layout>
      <>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Box
          bg={bg}
          color={fg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          flexDirection="column"
          p={4}
        >
          <Heading
            color={red}
            fontSize={["3xl", "4xl", "5xl"]}
            mb={4}
            textAlign="center"
          >
            404 - Page Not Found
          </Heading>
          <Box as="nav">
            <Box as="ul" listStyleType="none" p={0}>
              <Box as="li" color={fg}>
                <Link href="/">
                  <Text
                    color={useColorModeValue(
                      "brand.light.blue",
                      "brand.dark.blue"
                    )}
                    _hover={{ textDecoration: "underline" }}
                    fontSize="xl"
                  >
                    Get back Home
                  </Text>
                </Link>
              </Box>
            </Box>
          </Box>
          <Box as="main" mt={4}>
            <Text color={fg} fontSize="lg" textAlign="center">
              {"The page you're looking for does not exist."}
            </Text>
          </Box>
          <Box as="footer" mt={4}>
            <Text color={`${fg}4`} fontSize="sm" textAlign="center">
              Quicktick 2023
            </Text>
          </Box>
        </Box>
      </>
    </Layout>
  );
};

export default Custom404;
