import { theme } from "../_app";
import { NewTaskModal } from "../../components/create_new_task_modal";

import {
  useColorModeValue,
  useMediaQuery,
  ColorModeScript,
  Box,
  Select,
  Heading,
  Button,
  Text,
  Input,
  Spacer,
  VStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogHeader,
  HStack,
  Flex,
  Textarea,
  useDisclosure,
  chakra,
  Icon,
  Tooltip,
} from "@chakra-ui/react";

import React from "react";

import { useEffect, useRef, useState } from "react";

import {
  getAllUserTasks,
  deleteTask,
  updateTask,
  TaskAction,
  type Task,
  type TaskUpdateInput,
  deleteAllBoardTasks,
} from "../../api-consume/client/task";

import {
  BsTextRight,
  BsXSquare,
  BsX,
  BsLightningFill,
  BsSquare,
  BsPencilSquare,
} from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { TbArrowMoveRight } from "react-icons/tb";

import autoAnimate from "@formkit/auto-animate";

import { getAllUserBoards, type Board } from "~/api-consume/client/board";

enum SortBy {
  NameAscending,
  NameDescending,
  DateAscending,
  DateDescending,
  CompletedAscending,
  CompletedDescending,
}

import { useRouter } from "next/router";

import { type NextPageContext } from "next";

// eslint-disable-next-line @typescript-eslint/require-await
Todo.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx;
  return { query };
};

export default function Todo(props: {
  query: {
    boardUUID?: string;
  };
}) {
  const [device] = useState(Math.random().toString(36).substring(2, 15));

  const router = useRouter();

  // Task inspect/edit modal
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");
  const [editDescriptionInput, setEditDescriptionInput] = useState("");
  const [submittedEdit, setSubmittedEdit] = useState<boolean | null>(null);
  const [saveChanges, setSaveChanges] = useState(false);

  const [boards, setBoards] = useState<Board[]>([]);

  // used for least destructive ref
  const emptyRef = useRef(null);
  const cancelDeleteRef = useRef(null);

  // to check if the user is logged in

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  // error modal
  const [errorMessage, setErrorMessage] = useState("");
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [refetch, setRefetch] = useState(0);

  const [archiveUUID, setArchiveUUID] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const {
    isOpen: isInfoOpen,
    onOpen: onInfoOpen,
    onClose: onInfoClose,
  } = useDisclosure();

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setEditNameInput(task.name);
    setEditDescriptionInput(task.description);
    setIsOpenTaskModal(true);
  };

  const closeTaskModal = () => {
    setIsOpenTaskModal(false);
  };

  const [selectedBoard, setSelectedBoard] = useState<Board>();

  useEffect(() => {
    if (!isOpenTaskModal && submittedEdit !== null && !submittedEdit) {
      setEditName(false);
      setEditDescription(false);

      setSaveChanges(true);
    }
  }, [isOpenTaskModal, submittedEdit]);

  const [usedQuery, setUsedQuery] = useState(false);

  useEffect(() => {
    if (!usedQuery && props.query.boardUUID) {
      setUsedQuery(true);
    } else {
      if (selectedBoard) {
        const archive_uuid = boards.find((board) => board.special == 2)?.uuid;
        setArchiveUUID(archive_uuid ?? "");

        getAllUserTasks()
          .then((tasks) => {
            setTasks(tasks);
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
      }
    }
  }, [selectedBoard, refetch]);

  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");
  const orange = useColorModeValue("brand.light.orange", "brand.dark.orange");

  const [sort, setSort] = useState<SortBy>(SortBy.NameAscending);

  function sortTasks(sortBy: SortBy, a: Task, b: Task) {
    switch (sortBy) {
      case SortBy.NameAscending:
        return a.name.localeCompare(b.name);
      case SortBy.NameDescending:
        return b.name.localeCompare(a.name);
      case SortBy.CompletedAscending:
        return Number(a.completed) - Number(b.completed);
      case SortBy.CompletedDescending:
        return Number(b.completed) - Number(a.completed);
      default:
        return 0;
    }
  }

  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [initialDataFetched, setInitialDataFetched] = useState(false);

  function fetch_initial_data() {
    getAllUserBoards()
      .then((fetchedBoards) => {
        setBoards(fetchedBoards);

        // check props for boardUUID query
        const { query } = props;
        const boardUUID = query.boardUUID;

        if (boardUUID == undefined) {
          setSelectedBoard(boards.find((board) => board.special == 1));
        } else {
          const foundBoard = fetchedBoards.find(
            (board) => board.uuid === boardUUID,
          );
          if (foundBoard != undefined) {
            setSelectedBoard(foundBoard);
          }
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
  }
  useEffect(() => {
    if (!initialDataFetched) {
      fetch_initial_data();
      setInitialDataFetched(true);
    }
  }, [router, initialDataFetched]);

  useEffect(() => {
    setArchiveUUID(boards.find((board) => board.special == 2)?.uuid ?? "");
  }, [boards]);

  useEffect(() => {
    if (selectedBoard == undefined && archiveUUID != "") {
      setSelectedBoard(boards.find((board) => board.special == 1));
    }
  }, [archiveUUID]);

  const toggleTask = async (taskUUID: string) => {
    const taskToUpdate = tasks.find((task) => task.uuid === taskUUID);
    if (taskToUpdate) {
      const taskUpdateInput: TaskUpdateInput = {
        task_uuid: taskToUpdate.uuid,
        action: TaskAction.ToggleTask,
      };
      const updatedTasks = tasks.map((task) => {
        if (task.uuid === taskUUID) {
          return {
            ...task,
            completed: !task.completed,
          };
        } else {
          return task;
        }
      });
      setTasks(updatedTasks);
      await updateTask(taskUpdateInput, device);
    }
  };

  const saveChangesRef = useRef<HTMLButtonElement | null>(null);

  const [newTaskModal, setNewTaskModal] = useState(0);

  //websockets
  useEffect(() => {
    let ws = new WebSocket("wss://quicktick-api.fly.dev/ws");
    ws.addEventListener("open", () => {
      ws.send("hello");
    });
    ws.addEventListener("message", (e) => {
      console.log(e.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const [msg, device_identifier] = e.data.split(";");
      console.log(msg, device_identifier, device);
      if (msg == "update" && device_identifier !== device) {
        console.log("refetching");
        setRefetch((prev) => prev + 1);
      }
    });

    ws.addEventListener("close", () => {
      setTimeout(() => {
        ws = new WebSocket("wss://quicktick-api.fly.dev/ws");
        ws.addEventListener("open", () => {
          ws.send("hello");
        });
        ws.addEventListener("message", (e) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          const [msg, device_identifier] = e.data.split(";");
          if (msg == "update" && device_identifier !== device) {
            setRefetch((prev) => prev + 1);
          }
        });
      }, 5000);
    });
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box
        ref={parent}
        bg={bg}
        color={fg}
        display="flex"
        alignItems="center"
        height="100vh"
        overflow="scroll"
        flexDirection="column"
        key={"box"}
        // Listen for keypresses
      >
        <HStack key={"h-stack"}>
          <Heading as="h1" size="2xl" color={fg}>
            Todo
          </Heading>
        </HStack>
        <NewTaskModal
          isOpenTaskModal={isOpenTaskModal}
          setTasks={setTasks}
          boardUUID={selectedBoard ? selectedBoard.uuid : ""}
          bg={bg}
          fg={fg}
          orange={orange}
          newTaskModal={newTaskModal}
          device={device}
        />
        <HStack
          display="flex"
          flexDirection="row"
          alignItems={isLargerThan768 ? "center" : "flex-start"}
          justifyContent={isLargerThan768 ? "center" : "space-between"}
          w="full"
          maxW={500}
          mt={4}
          key={"h-stack-2"}
        >
          {isLargerThan768 && (
            <Text color={`${fg}4`} fontSize="sm" fontWeight="bold">
              Start typing to create
            </Text>
          )}
          <Spacer />

          <Text
            cursor="pointer"
            _hover={{
              color: `${orange}`,
            }}
            fontWeight="bold"
            color={`${fg}2`}
            fontSize="xl"
            onClick={() => {
              onInfoOpen();
            }}
          >
            ?
          </Text>
          <Spacer />

          <Select
            value={selectedBoard ? selectedBoard.uuid : ""}
            bg={`${bg}_h`}
            color={`${fg}`}
            onChange={(e) => {
              const selectedBoardUUID = e.target.value;
              const foundBoard = boards.find(
                (board) => board.uuid === selectedBoardUUID,
              );
              if (foundBoard) {
                setSelectedBoard(foundBoard);
              }
            }}
            borderWidth={2}
            borderColor={`${bg}2`}
            focusBorderColor={orange}
            maxWidth="150px"
            alignSelf="flex-end"
            mt={isLargerThan768 ? 0 : 4}
            key={"select1"}
          >
            {boards.map((board) => (
              <option key={board.uuid} value={board.uuid}>
                {board.label} {board.name}
              </option>
            ))}
          </Select>
          <Select
            value={sort}
            bg={`${bg}_h`}
            color={`${fg}`}
            onChange={(e) => {
              setSort(Number(e.target.value));
            }}
            borderWidth={2}
            borderColor={`${bg}2`}
            focusBorderColor={orange}
            maxWidth="150px"
            alignSelf="flex-end"
            mt={isLargerThan768 ? 0 : 4} // Adjust the margin for smaller screens
            key={"select"}
          >
            <option value={SortBy.NameAscending} key={SortBy.NameAscending}>
              A - Z
            </option>
            <option value={SortBy.NameDescending} key={SortBy.NameDescending}>
              Z - A
            </option>
            {/* <option value={SortBy.DateAscending}>Date Ascending</option> */}
            {/*<option value={SortBy.DateDescending}>Date Descending</option>*/}
            <option
              value={SortBy.CompletedAscending}
              key={SortBy.CompletedAscending}
            >
              Incompleted
            </option>
            <option
              value={SortBy.CompletedDescending}
              key={SortBy.CompletedDescending}
            >
              Completed
            </option>
          </Select>
        </HStack>

        {selectedBoard?.special !== 1 && (
          <Button
            key={"button"}
            onClick={() => {
              if (selectedBoard) {
                if (selectedBoard.special == 2) {
                  deleteAllBoardTasks(selectedBoard.uuid, device).catch(
                    (err: Error) => {
                      console.log(err);
                      setErrorMessage(
                        err.message + "Try refreshing." ||
                          "Something went wrong. Try refreshing",
                      );
                      onOpen();
                    },
                  );
                  setTasks([]);
                } else {
                  const archive_uuid = boards.find(
                    (board) => board.special == 2,
                  )?.uuid;

                  if (archive_uuid) {
                    // move all tasks to archive
                    const taskUpdateInput: TaskUpdateInput = {
                      task_uuid: "won't be used",
                      action: TaskAction.MovMoveAllTasksFromBoard,
                      NewBoard: archive_uuid,
                      OldBoard: selectedBoard?.uuid ?? "",
                    };
                    console.log(taskUpdateInput);

                    // change the board uuid of all tasks in this board
                    setTasks((prevTasks) =>
                      prevTasks.filter(
                        (task) => task.board_uuid !== selectedBoard?.uuid,
                      ),
                    );

                    updateTask(taskUpdateInput, device).catch((err: Error) => {
                      console.log(err);
                      // open error modal
                      setErrorMessage(
                        err.message + "Try refreshing." ||
                          "Something went wrong. Try refreshing",
                      );
                      onOpen();
                    });
                  }
                }
              }
            }}
            bg={`${bg}2`}
            color={`${fg}`}
            _hover={{ bg: `${bg}3` }}
            _active={{ bg: `${bg}1` }}
            maxW={500}
            w="full"
            mt={4}
            p={4}
            borderRadius="md"
            boxShadow="md"
          >
            {selectedBoard?.special == 2
              ? "Delete all permanently"
              : "Move all to archive"}
          </Button>
        )}

        {tasks
          .sort((a, b) => sortTasks(sort, a, b))
          .filter((task) => {
            if (selectedBoard?.special == 1) {
              const archive_uuid = boards.find((board) => board.special == 2)
                ?.uuid;
              return task.board_uuid != archive_uuid;
            } else {
              return task.board_uuid == selectedBoard?.uuid;
            }
          })
          .map((task) => (
            <Box
              zIndex={1}
              w="full"
              maxW={500}
              key={task.uuid}
              display="flex"
              flexDirection="row"
              alignItems="center"
              bg={`${bg}_h`}
              p={4}
              borderRadius="md"
              onClick={() => openTaskModal(task)}
              mt={4}
              boxShadow="md"
              transition="background-color 0.2s, transform 0.2s"
              _hover={{
                bg: `${bg}_h_hover`,
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
            >
              <Button
                zIndex={2}
                aria-label="toggle task status"
                mr={4}
                bg="transparent"
                _dark={{
                  bg: "transparent",
                  color: task.completed ? "brand.dark.orange" : "brand.dark.fg",
                }}
                color={task.completed ? "brand.light.orange" : "brand.light.fg"}
                _hover={{
                  color: "brand.light.orange",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(task.uuid).catch((err: Error) => {
                    console.log(err);
                    // open error modal
                    setErrorMessage(
                      err.message + "Try refreshing." ||
                        "Something went wrong. Try refreshing",
                    );
                    onOpen();
                  });
                }}
                p={0}
              >
                {task.completed ? (
                  <BsXSquare size={"33px"} />
                ) : (
                  <BsSquare size={"33px"} />
                )}
              </Button>
              <VStack align="flex-start" spacing={1}>
                <Text
                  fontWeight="bold"
                  color={`${fg}_h`}
                  // on mobile don't let the text be scrollable
                  overflowWrap="anywhere"
                  whiteSpace={"pre-wrap"}
                  noOfLines={2}
                >
                  {task.name}
                </Text>
                <Text
                  color={`${fg}2`}
                  overflowWrap="anywhere"
                  whiteSpace={"pre-wrap"}
                  noOfLines={3}
                >
                  {task.description.length > 100
                    ? task.description.substring(0, 100)
                    : task.description}
                </Text>
              </VStack>
              <Spacer />
              <Tooltip
                label="Move task to another board"
                aria-label="Move task to another board"
                openDelay={1000}
                variant="styled"
              >
                <Box position="relative">
                  <Select
                    zIndex={2}
                    variant="unstyled"
                    p={0}
                    w="32px"
                    h="32px"
                    bg={`${bg}_h`}
                    icon={<> </>}
                    color={fg}
                    borderWidth={0}
                    _hover={{
                      border: "1px",
                      borderStyle: "solid",
                      borderColor: fg,
                    }}
                    value={""}
                    focusBorderColor={orange}
                    alignSelf="center"
                    mt={isLargerThan768 ? 0 : 4}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      const selectedBoardUUID = e.target.value;

                      const foundBoard = boards.find(
                        (board) => board.uuid === selectedBoardUUID,
                      );
                      if (foundBoard) {
                        const taskUpdateInput: TaskUpdateInput = {
                          task_uuid: task.uuid,
                          action: TaskAction.MoveBoard,
                          NewBoard: selectedBoardUUID,
                        };
                        updateTask(taskUpdateInput, device).catch(
                          (err: Error) => {
                            console.log(err);
                            // open error modal
                            setErrorMessage(
                              err.message + "Try refreshing." ||
                                "Something went wrong. Try refreshing",
                            );
                            onOpen();
                          },
                        );
                        setTasks((prevTasks) =>
                          prevTasks.filter(
                            (t) => t.uuid !== taskUpdateInput.task_uuid,
                          ),
                        );
                      }
                    }}
                  >
                    <option value={""} disabled hidden defaultChecked>
                      {" "}
                    </option>
                    {boards
                      .filter((board) => board.uuid !== selectedBoard?.uuid)
                      .map((board) => (
                        <option key={board.uuid} value={board.uuid}>
                          {board.name}
                        </option>
                      ))}
                  </Select>
                  <TbArrowMoveRight
                    size="20px"
                    style={{
                      pointerEvents: "none",
                      zIndex: 5,
                      position: "absolute",
                      left: "7px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </Box>
              </Tooltip>

              <Tooltip
                label="Delete task"
                aria-label="Delete task"
                openDelay={1000}
                variant="styled"
              >
                <Button
                  zIndex={2}
                  aria-label="delete task"
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
                    if (selectedBoard?.special == 2) {
                      setSelectedTask(task);
                      onOpenDelete();
                    } else {
                      // special 2 is archive, so we just move it into it because it isn't already there
                      const taskUpdateInput: TaskUpdateInput = {
                        task_uuid: task.uuid,
                        action: TaskAction.MoveBoard,
                        NewBoard:
                          boards.find((board) => board.special == 2)?.uuid ??
                          "",
                      };
                      updateTask(taskUpdateInput, device).catch(
                        (err: Error) => {
                          console.log(err);
                          // open error modal
                          setErrorMessage(
                            err.message + "Try refreshing." ||
                              "Something went wrong. Try refreshing",
                          );
                          onOpen();
                        },
                      );
                      setTasks((prevTasks) =>
                        prevTasks.filter((t) => t.uuid !== task.uuid),
                      );
                    }
                  }}
                >
                  <BsX size={"30px"} />
                </Button>
              </Tooltip>
            </Box>
          ))}

        <AlertDialog
          leastDestructiveRef={emptyRef}
          isOpen={isOpenTaskModal}
          onClose={closeTaskModal}
          motionPreset="slideInBottom"
          isCentered
          key={"open-task-modal"}
        >
          <AlertDialogOverlay />
          {selectedTask && (
            <AlertDialogContent
              bg={`${bg}_h`}
              color={`${fg}`}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              p={4}
            >
              <AlertDialogHeader
                fontSize="2xl"
                color={`${fg}_h`}
                textAlign="left"
                w="full"
                p={0}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex alignItems="center">
                    <Button
                      aria-label="toggle task status"
                      mr={4}
                      bg="transparent"
                      _dark={{
                        bg: "transparent",
                        color: selectedTask.completed
                          ? "brand.dark.orange"
                          : "brand.dark.fg",
                      }}
                      color={
                        selectedTask.completed
                          ? "brand.light.orange"
                          : "brand.light.fg"
                      }
                      _hover={{
                        color: "brand.light.orange",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask((prevTask) => {
                          if (prevTask) {
                            return {
                              ...prevTask,
                              completed: !prevTask.completed,
                            };
                          } else {
                            return prevTask;
                          }
                        });

                        toggleTask(selectedTask.uuid).catch((err: Error) => {
                          console.log(err);
                          // open error modal
                          setErrorMessage(
                            err.message + "Try refreshing." ||
                              "Something went wrong. Try refreshing",
                          );
                          onOpen();
                        });
                      }}
                      p={0}
                    >
                      {selectedTask.completed ? (
                        <BsXSquare size={"33px"} />
                      ) : (
                        <BsSquare size={"33px"} />
                      )}
                    </Button>
                    <Box
                      onClick={() => {
                        setEditName(true);
                        setEditNameInput(selectedTask.name);
                      }}
                      _hover={{
                        cursor: "pointer",
                      }}
                    >
                      {editName ? (
                        <Input
                          value={editNameInput}
                          onChange={(e) => {
                            setEditNameInput(e.target.value);
                            setSubmittedEdit(false);
                          }}
                          onBlur={() => {
                            setEditName(false);
                            if (selectedTask.name == editNameInput) {
                              setSubmittedEdit(true);
                            }
                          }}
                        ></Input>
                      ) : (
                        <Text
                          fontWeight="bold"
                          color={`${fg}_h`}
                          overflowWrap="anywhere"
                        >
                          {editNameInput}
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  <Spacer />
                  <Button
                    aria-label="delete task"
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
                      if (selectedBoard?.special == 2) {
                        onOpenDelete();
                      } else {
                        // special 2 is archive, so we just move it into it because it isn't already there
                        const taskUpdateInput: TaskUpdateInput = {
                          task_uuid: selectedTask.uuid,
                          action: TaskAction.MoveBoard,
                          NewBoard:
                            boards.find((board) => board.special == 2)?.uuid ??
                            "",
                        };
                        updateTask(taskUpdateInput, device).catch(
                          (err: Error) => {
                            console.log(err);
                            // open error modal
                            setErrorMessage(
                              err.message + "Try refreshing." ||
                                "Something went wrong. Try refreshing",
                            );
                            onOpen();
                          },
                        );
                        setTasks((prevTasks) =>
                          prevTasks.filter((t) => t.uuid !== selectedTask.uuid),
                        );
                      }
                    }}
                  >
                    <BsX size={"30px"} />
                  </Button>

                  <Button
                    aria-label="modify task"
                    variant="ghost"
                    colorScheme="red"
                    size="sm"
                    alignSelf="center"
                    padding={0}
                    color={fg}
                    _hover={{
                      border: "1px",
                      borderStyle: "solid",
                      borderColor: fg,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditName(true);
                      setEditNameInput(selectedTask.name);
                      setEditDescription(true);
                      setEditDescriptionInput(selectedTask.description);
                    }}
                  >
                    <BsPencilSquare size={"20px"} />
                  </Button>
                </Flex>
              </AlertDialogHeader>
              <AlertDialogBody color={`${fg}_h`} w="full">
                <Box
                  onClick={() => {
                    setEditDescription(true);
                    setEditDescriptionInput(selectedTask.description);
                  }}
                  _hover={{
                    cursor: "pointer",
                  }}
                >
                  <Flex alignItems="left" w="full">
                    <BsTextRight size={"20px"} />
                    {editDescription ? (
                      <Textarea
                        w="full"
                        value={editDescriptionInput}
                        onChange={(e) => {
                          setEditDescriptionInput(e.target.value);
                          setSubmittedEdit(false);
                        }}
                        onBlur={() => {
                          setEditDescription(false);
                          if (
                            selectedTask.description == editDescriptionInput
                          ) {
                            setSubmittedEdit(true);
                          }
                        }}
                      ></Textarea>
                    ) : (
                      <Text
                        color={`${fg}2`}
                        // if overflow display on new line
                        overflowWrap="anywhere"
                        w="full"
                      >
                        {editDescriptionInput}
                      </Text>
                    )}
                  </Flex>
                </Box>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  onClick={closeTaskModal}
                  bg={`${bg}2`}
                  color={`${fg}`}
                  _hover={{ bg: `${bg}3` }}
                  _active={{ bg: `${bg}1` }}
                  w="full"
                  mr={submittedEdit !== null ? "10px" : "0px"}
                >
                  Close
                </Button>
                {submittedEdit !== null && (
                  <Button
                    bg={`brand.light.green`}
                    w="full"
                    color={`${fg}`}
                    _hover={{ bg: "brand.light.green_dim" }}
                    _active={{ bg: "brand.dark.green_dim" }}
                    aria-label="save changes"
                    alignSelf="center"
                    padding={3}
                    onClick={(e) => {
                      // submit the edited description
                      setEditDescription(false);
                      const taskUpdateName: TaskUpdateInput = {
                        task_uuid: selectedTask.uuid,
                        action: TaskAction.ChangeDesc,
                        NewDesc: editDescriptionInput,
                      };

                      setTasks((prevTasks) =>
                        prevTasks.map((t) => {
                          if (t.uuid === selectedTask.uuid) {
                            return {
                              ...t,
                              name: editNameInput,
                              description: editDescriptionInput,
                            };
                          } else {
                            return t;
                          }
                        }),
                      );

                      updateTask(taskUpdateName, device).catch((err: Error) => {
                        console.log(err);
                        // open error modal
                        setErrorMessage(
                          err.message + "Try refreshing." ||
                            "Something went wrong. Try refreshing",
                        );
                        onOpen();
                      });
                      e.stopPropagation();

                      // submit the edited name
                      setEditName(false);

                      const taskUpdateDesc: TaskUpdateInput = {
                        task_uuid: selectedTask.uuid,
                        action: TaskAction.RenameTask,
                        NewName: editNameInput,
                      };

                      updateTask(taskUpdateDesc, device).catch((err: Error) => {
                        console.log(err);
                        // open error modal
                        setErrorMessage(
                          err.message + "Try refreshing." ||
                            "Something went wrong. Try refreshing",
                        );
                        onOpen();
                      });

                      setSubmittedEdit(null);
                      setSaveChanges(false);
                      setIsOpenTaskModal(false);
                    }}
                  >
                    Save
                  </Button>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AlertDialog>

        <AlertDialog
          leastDestructiveRef={saveChangesRef}
          isOpen={saveChanges}
          onClose={() => {
            setSaveChanges(false);
          }}
          motionPreset="slideInBottom"
          isCentered
          key={"save-changes"}
        >
          <AlertDialogOverlay />
          <AlertDialogContent
            bg={`${bg}_h`}
            color={`${fg}`}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            p={4}
          >
            <AlertDialogHeader
              fontSize="2xl"
              color={`${fg}_h`}
              textAlign="left"
              w="full"
              p={0}
            >
              Looks like you have unsaved changes.
            </AlertDialogHeader>
            <AlertDialogBody color={`${fg}_h`} w="full">
              <HStack>
                <Button
                  ref={saveChangesRef}
                  onClick={() => {
                    if (selectedTask) {
                      // submit the edited description
                      setEditDescription(false);
                      const taskUpdateName: TaskUpdateInput = {
                        task_uuid: selectedTask.uuid,
                        action: TaskAction.ChangeDesc,
                        NewDesc: editDescriptionInput,
                      };

                      setTasks((prevTasks) =>
                        prevTasks.map((t) => {
                          if (t.uuid === selectedTask.uuid) {
                            return {
                              ...t,
                              name: editNameInput,
                              description: editDescriptionInput,
                            };
                          } else {
                            return t;
                          }
                        }),
                      );

                      updateTask(taskUpdateName, device).catch((err: Error) => {
                        console.log(err);
                        // open error modal
                        setErrorMessage(
                          err.message + "Try refreshing." ||
                            "Something went wrong. Try refreshing",
                        );
                        onOpen();
                      });

                      // submit the edited name
                      setEditName(false);

                      const taskUpdateDesc: TaskUpdateInput = {
                        task_uuid: selectedTask.uuid,
                        action: TaskAction.RenameTask,
                        NewName: editNameInput,
                      };

                      updateTask(taskUpdateDesc, device).catch((err: Error) => {
                        console.log(err);
                        // open error modal
                        setErrorMessage(
                          err.message + "Try refreshing." ||
                            "Something went wrong. Try refreshing",
                        );
                        onOpen();
                      });

                      setSubmittedEdit(null);
                      setSaveChanges(false);
                      setIsOpenTaskModal(false);
                    }
                  }}
                  bg={`${bg}2`}
                  color={`${fg}`}
                  _hover={{ bg: `${bg}3` }}
                  _active={{ bg: `${bg}1` }}
                  w="full"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setSaveChanges(false);
                    setSubmittedEdit(null);
                  }}
                  bg="brand.dark.red"
                  color={`${fg}`}
                  _hover={{ bg: "brand.light.red_dim" }}
                  _active={{ bg: "brand.light.red" }}
                  _dark={{
                    bg: "brand.dark.red",
                    _hover: { bg: "brand.dark.red_dim" },
                    _active: { bg: "brand.light.red" },
                  }}
                  w="full"
                  mr={submittedEdit !== null ? "10px" : "0px"}
                >
                  Discard
                </Button>
              </HStack>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          key={"error-modal"}
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
        <AlertDialog
          isOpen={isOpenDelete}
          leastDestructiveRef={cancelDeleteRef}
          onClose={onCloseDelete}
          key={"delete-modal"}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
              bg={`${bg}_h`}
              color={`${fg}`}
              display={"flex"}
              flexDirection={"column"}
            >
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Task
              </AlertDialogHeader>

              <AlertDialogBody>
                <Text
                  color={`${fg}1`}
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  overflowWrap="anywhere"
                >
                  {"Tasks deleted from archive can't be recovered."}
                </Text>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelDeleteRef}
                  onClick={onClose}
                  bg={`${bg}2`}
                  color={`${fg}`}
                  _hover={{ bg: `${bg}3` }}
                  _active={{ bg: `${bg}1` }}
                  w="full"
                  mr={submittedEdit !== null ? "10px" : "0px"}
                >
                  Cancel
                </Button>
                <Button
                  bg="brand.dark.red"
                  color={`${fg}`}
                  _hover={{ bg: "brand.light.red_dim" }}
                  _active={{ bg: "brand.light.red" }}
                  _dark={{
                    bg: "brand.dark.red",
                    _hover: { bg: "brand.dark.red_dim" },
                    _active: { bg: "brand.light.red" },
                  }}
                  w="full"
                  onClick={() => {
                    if (!selectedTask) {
                      return;
                    }
                    setTasks((prevTasks) =>
                      prevTasks.filter((t) => t.uuid !== selectedTask.uuid),
                    );
                    deleteTask(selectedTask.uuid, device).catch(
                      (err: Error) => {
                        console.log(err);
                        // open error modal
                        setErrorMessage(
                          err.message + "Try refreshing." ||
                            "Something went wrong. Try refreshing",
                        );
                        onOpen();
                      },
                    );
                    onCloseDelete();
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <AlertDialog
          isOpen={isInfoOpen}
          leastDestructiveRef={emptyRef}
          onClose={onInfoClose}
          key={"info-modal"}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
              bg={`${bg}_h`}
              color={`${fg}`}
              display={"flex"}
              flexDirection={"column"}
            >
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                How to
              </AlertDialogHeader>

              <AlertDialogBody>
                <Text
                  color={`${fg}1`}
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  overflowWrap="anywhere"
                >
                  {isLargerThan768 ? (
                    <Text>
                      - To create task use the orange button, <br />
                      - Click on a task or the pencil to edit. <br />
                      - To delete a task, click on the X.
                      <br />- To move a task to another board, click on the
                      arrow. <br />
                      - To mark a task as completed, click on the square.
                      <br />- To delete all tasks in a board, click on the red
                      button. <br />
                      - To change the board, click on the dropdown.
                      <br />- To change the sort order, click on the other
                      dropdown. <br />
                    </Text>
                  ) : (
                    <Text>
                      - Start typing to add a task <br />
                      - Click on a task to edit.
                      <br />
                      - To delete a task, click on the X.
                      <br />
                      - To move a task to another board, click on the arrow.
                      <br />
                      - To mark a task as completed, click on the square.
                      <br />
                      - To delete all tasks in a board, click on the red button.
                      <br />
                      - To change the board, click on the dropdown.
                      <br />
                      - To change the sort order, click on the other dropdown.
                      <br />
                    </Text>
                  )}
                </Text>
              </AlertDialogBody>

              <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Button
          zIndex={100}
          hidden={isLargerThan768}
          variant={"mobile_add_button"}
          onClick={() => {
            setNewTaskModal(newTaskModal + 1);
          }}
          borderRadius="full"
          key={"mobile-add-button"}
        >
          <FaPlus size={"30px"} />
        </Button>
      </Box>
    </>
  );
}
