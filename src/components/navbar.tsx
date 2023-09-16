import React, { useCallback, useEffect, useState } from "react";
import {
  chakra,
  Box,
  Flex,
  Text,
  useColorModeValue,
  HStack,
  Button,
  useDisclosure,
  VStack,
  IconButton,
  CloseButton,
  VisuallyHidden,
} from "@chakra-ui/react";
import { AiOutlineMenu } from "react-icons/ai";
import { BiSolidDashboard } from "react-icons/bi";
import { MdChecklistRtl } from "react-icons/md";
import { FaMoon, FaSun } from "react-icons/fa";

import { theme } from "../pages/_app";
import { useColorMode, ColorModeScript } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type User, authenticateUser } from "~/api-consume/client/user";

export default function Navbar() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");
  const { toggleColorMode } = useColorMode();
  const colorModeIcon = useColorModeValue(<FaMoon />, <FaSun />);

  const router = useRouter();

  const mobileNav = useDisclosure();

  // fetch the user name
  const [user, setUser] = useState<User | null>(null);

  const getUserData = useCallback(() => {
    console.log("getting user data");
    console.log(document.cookie);
    authenticateUser("cookie", "cookie")
      .then((userData) => {
        if (!userData) {
          router.push("/login").catch((err) => console.log(err));
        } else {
          setUser(userData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [router]);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (
      user &&
      (router.pathname === "/" || router.pathname === "/login") &&
      !router.query.show
    ) {
      router.push("/app").catch((err) => console.log(err));
    }
  }, [user, router]);

  return (
    <Box
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
      bg={bg}
      pb={11}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <chakra.header
        bg={bg}
        w="full"
        px={{ base: 2, sm: 4 }}
        pt={4}
        shadow="md"
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <HStack display="flex" spacing={3} alignItems="center">
            <Box display={{ base: "inline-flex", md: "none" }}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color={fg}
                _dark={{ color: fg }}
                variant="ghost"
                icon={<AiOutlineMenu />}
                onClick={mobileNav.onOpen}
              />
              <VStack
                pos="absolute"
                top={0}
                left={0}
                right={0}
                display={mobileNav.isOpen ? "flex" : "none"}
                flexDirection="column"
                p={2}
                pb={4}
                m={2}
                bg={bg}
                spacing={3}
                rounded="sm"
                shadow="sm"
              >
                <CloseButton
                  aria-label="Close menu"
                  justifySelf="self-start"
                  onClick={mobileNav.onClose}
                  color={`${fg}2`}
                  bg="transparent"
                />
                <Button
                  w="full"
                  variant="solid"
                  colorScheme="brand"
                  leftIcon={<MdChecklistRtl />}
                  _hover={{ bg: `${bg}3` }}
                  _active={{ bg: `${bg}1` }}
                  color={`${fg}2`}
                  bg={`${bg}2`}
                  onClick={() => {
                    router.push("/app").catch((err) => console.log(err));
                  }}
                >
                  <Link href="/app">To-Do</Link>
                </Button>
                <Button
                  w="full"
                  variant="solid"
                  colorScheme="brand"
                  leftIcon={<BiSolidDashboard />}
                  _hover={{ bg: `${bg}3` }}
                  _active={{ bg: `${bg}1` }}
                  color={`${fg}2`}
                  bg={`${bg}2`}
                  onClick={() => {
                    router.push("/app/board").catch((err) => console.log(err));
                  }}
                >
                  <Link href="/app/board">Boards</Link>
                </Button>
                <Box
                  mt={2}
                  w="full"
                  h="2px"
                  bg="brand.light.fg3"
                  _dark={{ bg: "brand.dark.fg3" }}
                />
              </VStack>
            </Box>
            <chakra.a
              href="/?show=force"
              title="Quicktick"
              display="flex"
              alignItems="center"
            >
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={30}
                height={30}
                style={{ borderRadius: "50%" }}
              />
              <VisuallyHidden>Quicktick Logo</VisuallyHidden>
            </chakra.a>

            <Link
              href="/"
              style={{
                //hide this to the user
                display: "none",
              }}
            ></Link>
            <HStack spacing={3} display={{ base: "none", md: "inline-flex" }}>
              <Button
                variant="solid"
                _hover={{ bg: `${bg}3` }}
                _active={{ bg: `${bg}2` }}
                leftIcon={<MdChecklistRtl />}
                size="sm"
                color={`${fg}2`}
                bg={`${bg}1`}
                onClick={() => {
                  router.push("/app").catch((err) => console.log(err));
                }}
              >
                <Link href="/app">To-Do</Link>
              </Button>
              <Button
                variant="solid"
                _hover={{ bg: `${bg}3` }}
                _active={{ bg: `${bg}2` }}
                leftIcon={<BiSolidDashboard />}
                size="sm"
                color={`${fg}2`}
                bg={`${bg}1`}
                onClick={() => {
                  router.push("/app/board").catch((err) => console.log(err));
                }}
              >
                <Link href="/app/board">Boards</Link>
              </Button>
            </HStack>
          </HStack>
          <HStack
            spacing={3}
            display={mobileNav.isOpen ? "none" : "flex"}
            alignItems="center"
          >
            <chakra.a
              p={3}
              color={fg}
              _dark={{ color: fg }}
              rounded="sm"
              _hover={{
                color: "brand.light.fg4",
                _dark: { color: "brand.dark.fg4" },
              }}
              onClick={toggleColorMode}
            >
              {colorModeIcon}
              <VisuallyHidden>Theme Switcher</VisuallyHidden>
            </chakra.a>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={fg}
              _dark={{ color: fg }}
            >
              {user ? (
                <Link href="/profile">{user.name}</Link>
              ) : (
                <>
                  <Button
                    variant="link"
                    size="sm"
                    color={`${fg}`}
                    onClick={() => {
                      router.push("/login").catch((err) => console.log(err));
                    }}
                  >
                    Log in
                  </Button>
                  {" | "}
                  <Button
                    variant="solid"
                    _hover={{ bg: `${bg}3` }}
                    _active={{ bg: `${bg}2` }}
                    size="sm"
                    color={`${fg}_h`}
                    bg={`${bg}1`}
                    onClick={() => {
                      router.push("/signup").catch((err) => console.log(err));
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </Text>
          </HStack>
        </Flex>
        <Box
          mt={2}
          w="full"
          h="2px"
          bg="brand.light.fg3"
          _dark={{ bg: "brand.dark.fg3" }}
        />
      </chakra.header>
    </Box>
  );
}
