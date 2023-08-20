import { theme } from "./_app";
import {
  useColorModeValue,
  ColorModeScript,
  Box,
  Text,
  chakra,
  Button,
  Stack,
  Image as ChakraImage,
  Icon,
} from "@chakra-ui/react";

import Image from "next/image";
export default function Home() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box
        bg={bg}
        color={fg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100vh"
      >
        <Box px={8} py={24} mx="auto">
          <Box
            w={{
              base: "full",
              md: 11 / 12,
              xl: 9 / 12,
            }}
            mx="auto"
            textAlign={{
              base: "left",
              md: "center",
            }}
          >
            <chakra.h1
              mb={6}
              fontSize={{
                base: "4xl",
                md: "6xl",
              }}
              fontWeight="bold"
              lineHeight="none"
              letterSpacing={{
                base: "normal",
                md: "tight",
              }}
              color={fg}
            >
              All your{" "}
              <Text
                display={{
                  base: "block",
                  lg: "inline",
                }}
                w="full"
                bgClip="text"
                bgGradient="linear(to-r, brand.dark.orange, brand.dark.yellow, brand.dark.red)"
                _dark={{
                  bgGradient:
                    "linear(to-r, brand.dark.orange, brand.dark.yellow, brand.dark.red)",
                }}
                fontWeight="extrabold"
              >
                Quick Ticks
              </Text>{" "}
              on all platforms.
            </chakra.h1>
            <chakra.p
              px={{
                base: 0,
                lg: 24,
              }}
              mb={6}
              fontSize={{
                base: "lg",
                md: "xl",
              }}
              color={`${fg}1`}
            >
              {
                " It's a clever and elegant solution of task management for inidviduals who desire an organized life."
              }
            </chakra.p>
            <Stack
              direction={{
                base: "column",
                sm: "row",
              }}
              mb={{
                base: 4,
                md: 8,
              }}
              spacing={2}
              justifyContent={{
                sm: "left",
                md: "center",
              }}
            >
              <Button
                color={`${fg}_h`}
                bg={`${bg}_h`}
                as="a"
                variant="solid"
                colorScheme="brand"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                w={{
                  base: "full",
                  sm: "auto",
                }}
                mb={{
                  base: 2,
                  sm: 0,
                }}
                size="lg"
                cursor="pointer"
              >
                Get Started
                <Icon
                  boxSize={4}
                  ml={1}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </Icon>
              </Button>
            </Stack>
          </Box>
          <Box
            w={{
              base: "full",
              md: 10 / 12,
            }}
            mx="auto"
            mt={20}
            textAlign="center"
          >
            <ChakraImage
              w="full"
              rounded="lg"
              shadow="2xl"
              alt="Quicktick todo page Image"
            />
          </Box>
        </Box>
        ;
      </Box>
    </>
  );
}
