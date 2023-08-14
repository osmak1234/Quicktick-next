import { theme } from "./_app";
import { useColorModeValue, ColorModeScript, Box } from "@chakra-ui/react";

export default function Home() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box bg={bg} color={fg} display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"


      >
        <h1>Home page under construction</h1>
      </Box>
    </>
  );
}
