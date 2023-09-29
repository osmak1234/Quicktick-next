import { theme } from "./_app";
import {
  useColorModeValue,
  ColorModeScript,
  Box,
  Text,
  chakra,
  Button,
  useMediaQuery,
  Stack,
  Image as ChakraImage,
  Icon,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
export default function Home() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");
  const image = useColorModeValue(
    "/quicktick-pc-2.avif",
    "/quicktick-pc-1.avif",
  );

  const router = useRouter();

  const [isMobile] = useMediaQuery("(max-width: 668px)");
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
        minH="100vh"
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
                onClick={() => {
                  router.push("/login").catch((err) => console.log(err));
                }}
              >
                Create account
              </Button>
                            <Box
                as="a"
                href="https://github.com/osmak1234/quicktick-next"
                ml={{
                  base: 0,
                  sm: 5,
                }}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                color={`${fg}_h`}
                w={{
                  base: "full",
                  sm: "auto",
                }}
              >
                <Text
                  fontSize={{
                    base: "lg",
                    md: "xl",
                  }}
                  color={`${fg}1`}
                  pr="2"
                >
                  Source Code
                </Text>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  >
                    <path d="M16 22.027v-2.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.75a5.07 5.07 0 0 0-.09-3.77s-1.18-.35-3.91 1.48a13.38 13.38 0 0 0-7 0c-2.73-1.83-3.91-1.48-3.91-1.48A5.07 5.07 0 0 0 5 5.797a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58v2.87"></path>
                    <path d="M9 20.027c-3 .973-5.5 0-7-3"></path>
                  </g>
                </svg>
              </Box>
            </Stack>
          </Box>
          <Box
            w="fit-content" // Set width to 100% to span the entire container
            mx="auto"
            bg={bg}
            shadow="lg"
            rounded="lg"
            overflow="hidden"
          >
            <ChakraImage
              w="100%" // Adjust the width to span the full container
              h={isMobile ? "300px" : "600px"} // Adjust the height for mobile and larger screens
              objectFit={isMobile ? "cover" : "contain"} // Change objectFit based on screen size
              objectPosition="center" // Adjust the cropping position
              rounded="lg"
              shadow="2xl"
              src={image}
              alt="Your Image"
            />
          </Box>
        </Box>
        ;
      </Box>
    </>
  );
}
