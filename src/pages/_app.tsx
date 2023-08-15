import { type AppType } from "next/app";
import "~/styles/globals.css";
import Navbar from "../components/navbar";
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import Head from "next/head";

const lightColors = {
  bg_h: "#f9f5d7",
  bg: "#fbf1c7",
  bg_s: "#f2e5bc",
  bg1: "#ebdbb2",
  bg2: "#d5c4a1",
  bg3: "#bdae93",
  bg4: "#a89984",

  fg: "#282828",
  fg1: "#3c3836",
  fg2: "#504945",
  fg3: "#665c54",
  fg4: "#7c6f64",

  red: "#9d0006",
  green: "#79740e",
  yellow: "#b57614",
  blue: "#076678",
  purple: "#8f3f71",
  aqua: "#427b58",
  orange: "#af3a03",
  gray: "#928374",

  red_dim: "#cc2412",
  green_dim: "#98971a",
  yellow_dim: "#d79921",
  blue_dim: "#458598",
  purple_dim: "#b16286",
  aqua_dim: "#689d6a",
  orange_dim: "#d65d0e",
  gray_dim: "#7c6f64",
};

const darkColors = {
  bg_h: "#1d2021",
  bg: "#282828",
  bg_s: "#32302f",
  bg1: "#3c3836",
  bg2: "#504945",
  bg3: "#665c54",
  bg4: "#7c6f64",

  fg: "#fbf1c7",
  fg1: "#ebdbb2",
  fg2: "#d5c4a1",
  fg3: "#bdae93",
  fg4: "#a89984",

  red: "#fb4934",
  green: "#b8bb26",
  yellow: "#fabd2f",
  blue: "#83a598",
  purple: "#d3869b",
  aqua: "#8ec07c",
  gray: "#928374",
  orange: "#fe8019",

  red_dim: "#cc2412",
  green_dim: "#98971a",
  yellow_dim: "#d79921",
  blue_dim: "#458588",
  purple_dim: "#b16286",
  aqua_dim: "#689d6a",
  gray_dim: "#a89984",
  orange_dim: "#d65d0e",
};

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

export const theme = extendTheme({ colors, config });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Quicktick</title>
        <meta name="The quick and simple todo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColorModeScript initialColorMode="dark" />
      <Navbar />
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
