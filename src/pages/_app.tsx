import { type AppType } from "next/app";
import "~/styles/globals.css";
import { components } from "../styles/chakra-ui";
import { lightColors, darkColors } from "../styles/color";
import Navbar from "../components/navbar";
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import Head from "next/head";

import { AnimatePresence } from "framer-motion";

const colors = {
  brand: {
    light: {
      ...lightColors,
    },
    dark: {
      ...darkColors,
    },
  },
};

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const global = {
  body: {
    bg: "brand.light.bg",
    color: "brand.light.fg",
  },
};

export const theme = extendTheme({ colors, config, components, global });

const MyApp: AppType = ({ Component, pageProps }) => {
  console.log(` ________________ 
< I use arch btw >
 ---------------- 
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||`);
  return (
    <ChakraProvider theme={theme}>
      <AnimatePresence mode="wait" initial={false}>
        <Head>
          <title>Quicktick</title>
          <meta name="The quick and simple todo app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ColorModeScript initialColorMode="dark" />
        <Navbar />
        <Component {...pageProps} />
      </AnimatePresence>
    </ChakraProvider>
  );
};

export default MyApp;
