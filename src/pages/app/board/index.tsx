import { useEffect, useState, useRef } from "react";
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
  Spacer,
} from "@chakra-ui/react";

import { theme } from "~/pages/_app";
import { useColorModeValue, ColorModeScript } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  getAllUserBoards,
  type Board,
  deleteBoard,
} from "~/api-consume/client/board";
import { BsLightningFill, BsX } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";

import NewBoardModal from "~/components/new_board_modal";

export default function Board() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");

  const device = Math.random().toString(36).substring(2, 15);

  const router = useRouter();

  const cancelRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [noBoards, setNoBoards] = useState<boolean>(false);

  // fetch the user name
  const [boards, setBoards] = useState<Board[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const [newBoardModal, setNewBoardModal] = useState<number>(0);

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    getAllUserBoards()
      .then((boards) => {
        setBoards(boards);
        if (boards.length === 0) {
          setNoBoards(true);
        }
      })
      .catch((err: Error) => {
        console.log(err);
        // open error modal
        setErrorMessage(
          err.message + "Try refreshing." ||
            "Something went wrong. Try refreshing",
        );
        onOpen();
      });
  }, [refresh, onOpen]);

  const parent = useRef(null);

  //websockets
  useEffect(() => {
    let ws = new WebSocket("wss://quicktick-api.fly.dev/ws");
    ws.addEventListener("open", () => {
      ws.send("hello");
    });
    ws.addEventListener("message", (e) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const [msg, device_identifier] = e.data.split(";");
      if (msg == "update" && device_identifier !== device) {
        setRefresh((prev) => prev + 1);
      }
    });

    ws.addEventListener("close", () => {
      console.log("disconnected");
      setTimeout(() => {
        ws = new WebSocket("wss://quicktick-api.fly.dev/ws");
        ws.addEventListener("open", () => {
          ws.send("hello");
        });
        ws.addEventListener("message", (e) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          const [msg, device_identifier] = e.data.split(";");
          if (msg == "update" && device_identifier !== device) {
            setRefresh((prev) => prev + 1);
          }
        });
      }, 5000);
    });
  }, []);

  return (
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
        device={device}
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
          rounded="lg"
          overflowY="hidden"
          overflowX="scroll"
          p={4}
        >
          <>
            {noBoards === true ? (
              <Heading as="h2" size="xl" color={fg}>
                You have no boards
              </Heading>
            ) : (
              <>
                {boards.map((board) => (
                  <Box
                    key={board.uuid}
                    bg={`${bg}_h`}
                    shadow="lg"
                    w="full"
                    display="flex"
                    flexDir="row"
                    rounded="lg"
                    borderWidth="1px"
                    borderColor={`${bg}2`}
                    textAlign="center"
                    p={4}
                    m={2}
                    _hover={{
                      borderColor: "brand.light.fg3",
                    }}
                    _dark={{
                      _hover: {
                        borderColor: "brand.dark.fg3",
                      },
                    }}
                    onClick={() => {
                      router
                        .push({
                          pathname: "/app",
                          query: { boardUUID: board.uuid },
                        })
                        .catch((err) => console.log(err));
                    }}
                  >
                    <Heading as="h2" size="md" color={fg} mt={2} mr={2}>
                      {board.label ?? "📝"}
                    </Heading>

                    <Heading as="h2" size="md" color={fg} mt={2}>
                      {board.name}
                    </Heading>
                    <Spacer />

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
                        onClick={(e) => {
                          e.stopPropagation();

                          if (board.special == 1 || board.special == 2) {
                            setErrorMessage("You cannot delete this board.");
                            onOpen();
                            return;
                          } else {
                            deleteBoard(board.uuid, device)
                              .then(() => {
                                setBoards(
                                  boards.filter((b) => b.uuid !== board.uuid),
                                );
                              })
                              .catch((err: Error) => {
                                console.log(err);
                                // open error NewBoardModal
                                setErrorMessage(
                                  err.message + "Try refreshing." ||
                                    "Something went wrong. Try refreshing",
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
              </>
            )}
          </>
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
        zIndex={100}
        variant={"mobile_add_button"}
        onClick={() => {
          setNewBoardModal(newBoardModal + 1);
        }}
        borderRadius="full"
      >
        <FaPlus size={"30px"} />
      </Button>
    </>
  );
}
