import {
  useColorModeValue,
  ColorModeScript,
  Box,
  Heading,
  Text,
  Input,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Link as ChakraLink,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  Icon,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState, useRef } from "react";

import dynamic from "next/dynamic";

import { useRouter } from "next/router";

import * as EmailValidator from "email-validator";

import { type User, createUser } from "~/api-consume/client/user";
import { BsLightningFill } from "react-icons/bs";
import { IoMdCheckmarkCircle } from "react-icons/io";

const SignUpPage = () => {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");
  const orange = useColorModeValue("brand.light.orange", "brand.dark.orange");

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [stopSubmit, setStopSubmit] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const [accoundCreation, setAccountCreation] = useState<boolean | null>(null);

  async function login() {
    setEmailError(false);
    setStopSubmit(true);
    if (!EmailValidator.validate(email)) {
      setEmailError(true);
      if (email.length < 1) {
        setStopSubmit(false);
        throw new Error("Email is required");
      } else {
        setStopSubmit(false);
        throw new Error("Invalid email");
      }
    } else if (name.length < 5) {
      setNameError(false);
      setStopSubmit(false);
      throw new Error("Name must contain at least 5 characters.");
    } else if (password.length < 6) {
      setStopSubmit(false);
      setEmailError(false);
      setPasswordError(true);
      throw new Error("Password must be at least 6 characters long.");
    } else {
      const user: User = {
        name,
        email,
        password,
      };
      const response = await createUser(user);

      if (response.status === 200) {
        onOpen();
        setAccountCreation(true);
      } else {
        setStopSubmit(false);
        throw new Error("Failed while subimitting form try again");
      }
    }
  }

  return (
    <>
      <ColorModeScript initialColorMode="light" />
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
          <Heading
            color={orange}
            _dark={{
              color: orange,
            }}
            fontSize={["3xl", "4xl", "5xl"]}
            mb={4}
            textAlign="center"
          >
            Sign Up
          </Heading>
          <Box
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap={4}
          >
            <FormControl
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={4}
              mb={3}
              onSubmit={() => {
                login()
                  .then(() => {
                    router.push("/").catch((err) => {
                      console.log(err);
                    });
                  })
                  .catch((err: Error) => {
                    setErrorMessage(err.message);
                    onOpen();
                    console.log(err);
                  });
              }}
            >
              <FormLabel
                color={`${fg}2`}
                fontSize={["md", "lg", "xl"]}
                fontWeight="bold"
              >
                Email Address
              </FormLabel>
              <Input
                isInvalid={emailError}
                maxW={500}
                w="full"
                m="auto"
                focusBorderColor={orange}
                borderColor={`${bg}2`}
                color={`${fg}_h`}
                bg={`${bg}_h`}
                borderWidth={2}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <FormLabel
                color={`${fg}2`}
                fontSize={["md", "lg", "xl"]}
                fontWeight="bold"
              >
                Name
              </FormLabel>
              <Input
                isInvalid={nameError}
                maxW={500}
                w="full"
                m="auto"
                focusBorderColor={orange}
                borderColor={`${bg}2`}
                color={`${fg}_h`}
                bg={`${bg}_h`}
                borderWidth={2}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />

              <FormLabel
                color={`${fg}2`}
                fontSize={["md", "lg", "xl"]}
                fontWeight="bold"
              >
                Password
              </FormLabel>
              <Input
                isInvalid={passwordError}
                w="full"
                m="auto"
                maxW={500}
                borderColor={`${bg}2`}
                color={`${fg}_h`}
                bg={`${bg}_h`}
                borderWidth={2}
                focusBorderColor={orange}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </FormControl>
            <Button
              mt={4}
              maxW={500}
              m="auto"
              _hover={{ bg: `${bg}3` }}
              _active={{ bg: `${bg}1` }}
              color={`${fg}2`}
              bg={`${bg}2`}
              w="full"
              mb={4}
              disabled={stopSubmit}
              isLoading={stopSubmit}
              _loading={{
                bg: `${bg}2`,
                color: `${fg}2`,
              }}
              onClick={() => {
                login()
                  .then(() => {
                    router.push("/app").catch((err) => {
                      console.log(err);
                    });
                  })
                  .catch((err: Error) => {
                    setErrorMessage(err.message);
                    onOpen();
                    console.log(err);
                  });
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  login()
                    .then(() => {
                      if (accoundCreation) {
                        router.push("/app").catch((err) => {
                          console.log(err);
                        });
                      }
                    })
                    .catch((err: Error) => {
                      setErrorMessage(err.message);
                      console.log(err);
                    });
                }
              }}
            >
              Sign Up
            </Button>
          </Box>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent
                bg="transparent"
                _dark={{
                  bg: "transparent",
                }}
                p={0}
              >
                {errorMessage.length > 0 && (
                  <Flex
                    w="full"
                    bg="transparent"
                    _dark={{
                      bg: "transparent",
                    }}
                    p={0}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Flex
                      w="full"
                      mx="auto"
                      bg={`${bg}_h`}
                      _dark={{
                        bg: `${bg}_h`,
                      }}
                      shadow="md"
                      rounded="lg"
                      overflow="hidden"
                    >
                      <Flex
                        justifyContent="center"
                        alignItems="center"
                        w={12}
                        bg="brand.light.red"
                        _dark={{
                          bg: "brand.dark.red",
                        }}
                      >
                        <Icon
                          as={BsLightningFill}
                          color="brand.light.fg"
                          _dark={{
                            color: "brand.light.fg",
                          }}
                          boxSize={6}
                        />
                      </Flex>

                      <Box mx={-3} py={2} px={4}>
                        <chakra.span
                          color={fg}
                          _dark={{
                            color: { fg },
                          }}
                          fontWeight="bold"
                        >
                          Error
                        </chakra.span>
                        <chakra.p
                          color={fg}
                          _dark={{
                            color: { fg },
                          }}
                          fontSize="sm"
                        >
                          {errorMessage || "Something went wrong"}
                        </chakra.p>
                      </Box>
                    </Flex>
                  </Flex>
                )}
                {accoundCreation && (
                  <Flex
                    w="full"
                    bg="transparent"
                    _dark={{
                      bg: "transparent",
                    }}
                    p={0}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Flex
                      w="full"
                      mx="auto"
                      bg={`${bg}_h`}
                      _dark={{
                        bg: `${bg}_h`,
                      }}
                      shadow="md"
                      rounded="lg"
                      overflow="hidden"
                    >
                      <Flex
                        justifyContent="center"
                        alignItems="center"
                        w={12}
                        bg="brand.light.green"
                        _dark={{
                          bg: "brand.dark.green",
                        }}
                      >
                        <Icon
                          as={IoMdCheckmarkCircle}
                          color="brand.light.fg"
                          _dark={{
                            color: "brand.light.fg",
                          }}
                          boxSize={6}
                        />
                      </Flex>

                      <Box mx={-3} py={2} px={4}>
                        <Box mx={3}>
                          <chakra.span
                            color="green.500"
                            _dark={{
                              color: "green.400",
                            }}
                            fontWeight="bold"
                          >
                            Success
                          </chakra.span>
                          <chakra.p
                            color="gray.600"
                            _dark={{
                              color: "gray.200",
                            }}
                            fontSize="sm"
                          >
                            Your account was registered!
                          </chakra.p>
                          <Link
                            href="/app"
                            about="Go to app"
                            color="brand.light.blue_dim"
                            style={{
                              textDecoration: "underline",
                            }}
                          >
                            To app
                          </Link>
                        </Box>
                      </Box>
                    </Flex>
                  </Flex>
                )}
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          <Flex justifyContent="center" alignItems="center" flexDir="column">
            <Text color={`${fg}4`}>
              {"Passwords are ecrypted before storing."}
            </Text>
            <Text color={fg} mr={2}>
              {" Already have an account?"}
            </Text>
            <Link href="/login">
              <ChakraLink
                color="brand.light.blue_dim"
                _hover={{
                  color: "brand.dark.blue_dim",
                  textDecoration: "underline",
                }}
              >
                Log In
              </ChakraLink>
            </Link>
          </Flex>
          <Text color={`${fg}4`} fontSize="sm" textAlign="center" mt="100px">
            Quicktick 2023
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default dynamic(() => Promise.resolve(SignUpPage), { ssr: false });
