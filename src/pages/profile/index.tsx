import { useEffect, useState, useCallback, useRef } from "react";
import {
  AlertDialog,
  Text,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  Heading,
  Input,
  Spacer,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

import { theme } from "../_app";
import { useColorModeValue, ColorModeScript } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  type User,
  authenticateUser,
  logout,
  changeUserName,
  deleteUser,
} from "~/api-consume/client/user";
import Layout from "~/components/layout";

import { CgProfile } from "react-icons/cg";
import { BsPencilSquare } from "react-icons/bs";

export default function Profile() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");

  const router = useRouter();

  // fetch the user name
  const [user, setUser] = useState<User | null>(null);

  const [changeName, setChangeName] = useState(false);
  const [newName, setNewName] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef<HTMLButtonElement | null>(null);

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

  function handle_name_change() {
    if (newName.trim() !== "") {
      setUser(
        user && {
          ...user,
          name: newName,
        }
      );
      setChangeName(false);
      changeUserName(newName).catch((err) => {
        console.log(err);
      });
    }
  }

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
                <HStack>
                  {changeName ? (
                    <>
                      <CgProfile size={50} />
                      <VStack>
                        <Input
                          w="full"
                          m={3}
                          fontSize={"3xl"}
                          size={"lg"}
                          borderColor={`${bg}2`}
                          color={`${fg}_h`}
                          bg={`${bg}_h`}
                          borderWidth={2}
                          focusBorderColor="brand.dark.orange"
                          value={newName}
                          maxLength={190}
                          onChange={(e) => {
                            setNewName(e.target.value);
                          }}
                        ></Input>
                        <HStack>
                          <Button
                            variant="solid"
                            _hover={{ bg: `${bg}3` }}
                            _active={{ bg: `${bg}1` }}
                            color={`${fg}2`}
                            bg={`${bg}2`}
                            onClick={() => {
                              handle_name_change();
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="solid"
                            _hover={{ bg: `${bg}3` }}
                            _active={{ bg: `${bg}1` }}
                            color={`${fg}2`}
                            bg={`${bg}2`}
                            onClick={() => {
                              setChangeName(false);
                              setNewName(user?.name || "");
                            }}
                          >
                            Cancel
                          </Button>
                        </HStack>
                      </VStack>
                    </>
                  ) : (
                    <>
                      <CgProfile size={50} />
                      <Heading
                        as="h2"
                        size="md"
                        color={fg}
                        onClick={() => {
                          setNewName(user?.name || "");
                          setChangeName(true);
                        }}
                      >
                        {user?.name}
                      </Heading>
                    </>
                  )}
                  <Spacer />
                  <BsPencilSquare
                    size={40}
                    onClick={() => {
                      setNewName(user?.name || "");
                      setChangeName(true);
                    }}
                  />
                </HStack>
                <Heading as="h2" size="md" color={fg} mt={10}>
                  {user?.email}
                </Heading>

                <Button
                  variant="solid"
                  _hover={{ bg: `${bg}3` }}
                  _active={{ bg: `${bg}1` }}
                  color={`${fg}2`}
                  bg={`${bg}2`}
                  w="full"
                  mt={10}
                  onClick={() => {
                    logout()
                      .then(() => {
                        router.push("/").catch((err) => {
                          console.log(err);
                        });
                        alert("Logged out!");
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  Log out
                </Button>
                <Button
                  variant="solid"
                  //red collors
                  bg="brand.light.red"
                  _hover={{ bg: "brand.light.red_dim" }}
                  _active={{ bg: "brand.dark.red" }}
                  color="brand.light.fg"
                  //dark collors
                  _dark={{
                    bg: "brand.dark.red",
                    _hover: { bg: "brand.dark.red_dim" },
                    _active: { bg: "brand.light.red" },
                    color: "brand.dark.fg",
                  }}
                  w="full"
                  mt={2}
                  onClick={() => {
                    onOpen();
                  }}
                >
                  Delete account
                </Button>
              </>
            ) : (
              <Heading as="h2" size="xl" color={fg}></Heading>
            )}
          </Box>
        </Box>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
              color="brand.light.fg"
              bg="brand.light.bg"
              _dark={{
                color: "brand.dark.fg",
                bg: "brand.dark.bg",
              }}
              p={4}
            >
              <>
                <Heading as="h2" size="lg" color={`${fg}_h`} pb={4}>
                  Delete Account
                </Heading>
                <Text>
                  There is no going back, all tasks, boards, and account data
                  will be lost.
                </Text>
                <Button
                  maxW={500}
                  _hover={{ bg: `${bg}3` }}
                  _active={{ bg: `${bg}1` }}
                  color={`${fg}2`}
                  bg={`${bg}2`}
                  w="full"
                  mt={10}
                  mb={4}
                  onClick={() => {
                    onClose();
                  }}
                >
                  Close
                </Button>
                <Button
                  maxW={500}
                  bg="brand.light.red"
                  _hover={{ bg: "brand.light.red_dim" }}
                  _active={{ bg: "brand.dark.red" }}
                  color="brand.light.fg"
                  //dark collors
                  _dark={{
                    bg: "brand.dark.red",
                    _hover: { bg: "brand.dark.red_dim" },
                    _active: { bg: "brand.light.red" },
                    color: "brand.dark.fg",
                  }}
                  w="full"
                  mb={4}
                  onClick={() => {
                    deleteUser()
                      .then(() => {
                        router.push("/").catch((err) => {
                          console.log(err);
                        });
                        alert("Account deleted!");
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  Delete
                </Button>
              </>
            </AlertDialogContent>{" "}
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    </Layout>
  );
}
