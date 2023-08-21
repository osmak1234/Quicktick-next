import { useEffect, useState, useCallback, useRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Text,
  Button,
  Flex,
  Heading,
  Icon,
  chakra,
  useDisclosure,
  useMediaQuery,
  SimpleGrid,
  Image,
  Tooltip,
} from "@chakra-ui/react";

import { theme } from "~/pages/_app";
import { useColorModeValue, ColorModeScript } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { type User, authenticateUser } from "~/api-consume/client/user";
import {
  getAllUserBoards,
  type Board,
  deleteBoard,
} from "~/api-consume/client/board";
import { BsLightningFill, BsX } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";

import Layout from "~/components/layout";
import NewBoardModal from "~/components/new_board_modal";

import autoAnimate from "@formkit/auto-animate";

export default function Board() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");

  const router = useRouter();

  const cancelRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // fetch the user name
  const [user, setUser] = useState<User | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const [newBoardModal, setNewBoardModal] = useState<number>(0);

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
  }, []);

  useEffect(() => {
    getUserData();
    getAllUserBoards()
      .then((boards) => setBoards(boards))
      .catch((err: Error) => {
        console.log(err);
        // open error modal
        setErrorMessage(
          err.message + "Try refreshing." ||
            "Something went wrong. Try refreshing"
        );
        onOpen();
      });
  }, [getUserData]);

  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <Layout>
      <>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <NewBoardModal
          bg={bg}
          fg={fg}
          orange="brand.light.orange"
          setBoards={setBoards}
          isOpenBoardModal={false}
          newBoardModal={newBoardModal}
        />
        <Box
          ref={parent}
          bg={bg}
          color={fg}
          display="flex"
          minHeight="96vh"
          overflowX="scroll"
          flexDirection="column"
          p={4}
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mx="auto"
            flexDir="column"
          >
            <Heading as="h1" size="2xl" color={fg}>
              Boards
            </Heading>
            {isLargerThan768 && (
              <Text fontSize="xl" color={`${fg}3`} mr={4}>
                Start typing to create a board.
              </Text>
            )}
          </Flex>

          <Box
            w="full"
            maxW="700px"
            mx="auto"
            bg={`${bg}_h`}
            shadow="lg"
            rounded="lg"
            overflowY="hidden"
            overflowX="scroll"
            p={4}
          >
            {!user ? (
              <Heading as="h2" size="xl" color={fg}>
                Logging in...
              </Heading>
            ) : (
              <>
                {boards.length === 0 ? (
                  <Heading as="h2" size="xl" color={fg}>
                    You have no boards
                  </Heading>
                ) : (
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
                    spacing={{ base: 6, sm: 8, md: 8 }}
                    overflowX={"scroll"}
                  >
                    {boards.map((board) => (
                      <Box
                        key={board.uuid}
                        bg={`${bg}_h`}
                        shadow="lg"
                        rounded="lg"
                        borderWidth="1px"
                        borderColor={`${bg}_darker`}
                        textAlign="center"
                        pb={4}
                        _hover={{
                          borderColor: "gray.400",
                        }}
                        // TODO: after clicking select board on app page, go to that board
                        onClick={() => {
                          // add query params with board uuid
                          router
                            .push({
                              pathname: "/app",
                              query: { boardUUID: board.uuid },
                            })
                            .catch((err) => console.log(err));
                        }}
                      >
                        <Image
                          src="/gruvbox_todo_board.jpg"
                          alt={board.name}
                          width="100%"
                          height="140px"
                          objectFit="cover"
                          style={{
                            borderRadius: "5%",
                          }}
                        />
                        <Heading as="h2" size="md" color={fg} mt={2}>
                          {board.name}
                        </Heading>

                        <Tooltip
                          label="Delete board"
                          aria-label="Delete board"
                          openDelay={1000}
                          variant="styled"
                        >
                          <Button
                            zIndex={0}
                            aria-label="delete board"
                            variant="ghost"
                            colorScheme="red"
                            size="sm"
                            alignSelf="center"
                            padding={0}
                            color="brand.light.red"
                            _dark={{ color: "brand.dark.red" }}
                            _hover={{
                              border: "1px",
                              borderStyle: "solid",
                              borderColor: "red.500",
                            }}
                            onClick={() => {
                              if (board.special == 1 || board.special == 2) {
                                setErrorMessage(
                                  "You cannot delete this board."
                                );
                                onOpen();
                                return;
                              } else {
                                deleteBoard(board.uuid)
                                  .then(() => {
                                    setBoards(
                                      boards.filter(
                                        (b) => b.uuid !== board.uuid
                                      )
                                    );
                                  })
                                  .catch((err: Error) => {
                                    console.log(err);
                                    // open error NewBoardModal
                                    setErrorMessage(
                                      err.message + "Try refreshing." ||
                                        "Something went wrong. Try refreshing"
                                    );
                                    onOpen();
                                  });

                                console.log("delete board");
                              }
                            }}
                          >
                            <BsX size={"30px"} />
                          </Button>
                        </Tooltip>
                      </Box>
                    ))}
                  </SimpleGrid>
                )}
              </>
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
              bg="transparent"
              _dark={{
                bg: "transparent",
              }}
              p={0}
            >
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
                      color="white"
                      _dark={{
                        color: "white",
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
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Button
          hidden={isLargerThan768}
          variant={"mobile_add_button"}
          onClick={() => {
            setNewBoardModal(newBoardModal + 1);
          }}
          borderRadius="full"
        >
          <FaPlus size={"30px"} />
        </Button>
      </>
    </Layout>
  );
}
