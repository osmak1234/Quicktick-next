import { useEffect, useState, useCallback } from "react";
import { Box, Button, Heading } from "@chakra-ui/react";

import { theme } from "../_app";
import { useColorModeValue, ColorModeScript } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { type User, authenticateUser, logout } from "~/api-consume/client/user";
import Layout from "~/components/layout";

export default function Profile() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");

  const router = useRouter();

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
  }, []); // No dependencies since it doesn't depend on any props or state

  useEffect(() => {
    getUserData();
  }, [getUserData]); // Include getUserData as a dependency here

  return (
    <Layout>
      {" "}
      <>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Box
          bg={bg}
          color={fg}
          display="flex"
          height="100vh"
          flexDirection="column"
          p={4}
        >
          <Box
            w="full"
            maxW="500px"
            mx="auto"
            bg={`${bg}_h`}
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            p={4}
          >
            {user ? (
              <>
                <Heading as="h2" size="xl" color={fg}>
                  {user?.name}
                </Heading>
                <Button
                  variant="solid"
                  _hover={{ bg: `${bg}3` }}
                  _active={{ bg: `${bg}1` }}
                  color={`${fg}2`}
                  bg={`${bg}2`}
                  onClick={() => {
                    logout()
                      .then(() => {
                        window.location.reload();
                        alert("Logged out!");
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Heading as="h2" size="xl" color={fg}></Heading>
            )}
          </Box>
        </Box>
      </>
    </Layout>
  );
}
