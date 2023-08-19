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
} from "@chakra-ui/react";

import React from "react";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getAllUserTasks,
  deleteTask,
  updateTask,
  TaskAction,
  type Task,
  type TaskUpdateInput,
} from "../../api-consume/client/task";

import { authenticateUser, type User } from "../../api-consume/client/user";

import {
  BsTextRight,
  BsXSquare,
  BsX,
  BsSquare,
  BsPencilSquare,
} from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import autoAnimate from "@formkit/auto-animate";

enum SortBy {
  NameAscending,
  NameDescending,
  DateAscending,
  DateDescending,
  CompletedAscending,
  CompletedDescending,
}

export default function Todo() {
  // Task inspect/edit modal
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");
  const [editDescriptionInput, setEditDescriptionInput] = useState("");
  const [submittedEdit, setSubmittedEdit] = useState<boolean | null>(null);
  const [saveChanges, setSaveChanges] = useState(false);

  // used for least destructive ref
  const emptyRef = useRef(null);

  // to check if the user is logged in
  const [user, setUser] = useState<User | null>(null);

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setEditNameInput(task.name);
    setEditDescriptionInput(task.description);
    setIsOpenTaskModal(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setIsOpenTaskModal(false);
  };

  useEffect(() => {
    if (
      (!isOpenTaskModal && editName && !submittedEdit) ||
      (!isOpenTaskModal && editDescription && !submittedEdit)
    ) {
      setEditName(false);
      setEditDescription(false);

      setSaveChanges(true);
    } else if (!isOpenTaskModal) {
      setEditName(false);
      setEditDescription(false);
    }
  }, [isOpenTaskModal, editName, editDescription, submittedEdit]);

  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");
  const orange = useColorModeValue("brand.light.orange", "brand.dark.orange");

  const [sort, setSort] = useState<SortBy>(SortBy.NameAscending);

  const parent = useRef(null);

  function sortTasks(sortBy: SortBy, a: Task, b: Task) {
    switch (sortBy) {
      case SortBy.NameAscending:
        return a.name.localeCompare(b.name);
      case SortBy.NameDescending:
        return b.name.localeCompare(a.name);
      //     case SortBy.DateAscending:
      //       return a.created_at.localeCompare(b.created_at);
      //     case SortBy.DateDescending:
      //       return b.created_at.localeCompare(a.created_at);
      case SortBy.CompletedAscending:
        return Number(a.completed) - Number(b.completed);
      case SortBy.CompletedDescending:
        return Number(b.completed) - Number(a.completed);
      default:
        return 0;
    }
  }

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  // fetch the user name

  const getUserData = useCallback(() => {
    console.log("getting user data");
    authenticateUser("cookie", "cookie")
      .then((userData) => {
        if (!userData) {
          alert("User not found");
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

  const [tasks, setTasks] = useState<Task[]>([]);

  function fetch_initial_data() {
    // Get all all tasksA
    getAllUserTasks()
      .then((tasks) => setTasks(tasks))
      .catch((err) => {
        console.log(err);
      });

    // Get user data
    console.log("getting user data");
  }
  useEffect(() => {
    fetch_initial_data();
  }, []);

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
      await updateTask(taskUpdateInput);
    }
  };

  const saveChangesRef = useRef<HTMLButtonElement | null>(null);

  const [newTaskModal, setNewTaskModal] = useState(0);

  // onOpen for NewTaskModal

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
        // Listen for keypresses
      >
        <Heading as="h1" size="2xl" color={fg}>
          Todo
        </Heading>
        {!user ? (
          <Text>Not logged in</Text>
        ) : (
          <>
            <NewTaskModal
              isOpenTaskModal={isOpenTaskModal}
              setTasks={setTasks}
              bg={bg}
              fg={fg}
              orange={orange}
              newTaskModal={newTaskModal}
            />
            <HStack
              display="flex"
              flexDirection="row"
              alignItems={isLargerThan768 ? "center" : "flex-start"}
              justifyContent={isLargerThan768 ? "center" : "space-between"}
              w="full"
              maxW={500}
              mt={4}
            >
              {isLargerThan768 && (
                <Text color={`${fg}4`} fontSize="xl" fontWeight="bold">
                  Start typing to add a task
                </Text>
              )}
              <Spacer />
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
                maxWidth="200px"
                alignSelf="flex-end"
                mt={isLargerThan768 ? 0 : 4} // Adjust the margin for smaller screens
              >
                <option value={SortBy.NameAscending}>A - Z</option>
                <option value={SortBy.NameDescending}>Z - A</option>
                {/* <option value={SortBy.DateAscending}>Date Ascending</option> */}
                {/*<option value={SortBy.DateDescending}>Date Descending</option>*/}
                <option value={SortBy.CompletedAscending}>Incompleted</option>
                <option value={SortBy.CompletedDescending}>Completed</option>
              </Select>
            </HStack>

            {tasks
              .sort((a, b) => sortTasks(sort, a, b))
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
                      color: task.completed
                        ? "brand.dark.orange"
                        : "brand.dark.fg",
                    }}
                    color={
                      task.completed ? "brand.light.orange" : "brand.light.fg"
                    }
                    _hover={{
                      color: "brand.light.orange",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.uuid).catch((err) => {
                        console.log(err);
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
                    >
                      {task.name}
                    </Text>
                    <Text color={`${fg}2`} overflowWrap="anywhere">
                      {task.description.length > 100
                        ? task.description.substring(0, 100) + "..."
                        : task.description}
                    </Text>
                  </VStack>
                  <Spacer />
                  <Button
                    zIndex={2}
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
                      setEditNameInput(task.name);
                      setEditDescription(true);
                      setEditDescriptionInput(task.description);
                      openTaskModal(task);
                    }}
                  >
                    <BsPencilSquare size={"20px"} />
                  </Button>
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
                      setTasks((prevTasks) =>
                        prevTasks.filter((t) => t.uuid !== task.uuid)
                      );
                      deleteTask(task.uuid).catch((err) => {
                        console.log(err);
                      });
                    }}
                  >
                    <BsX size={"30px"} />
                  </Button>
                </Box>
              ))}
          </>
        )}

        <AlertDialog
          leastDestructiveRef={emptyRef}
          isOpen={isOpenTaskModal}
          onClose={closeTaskModal}
          motionPreset="slideInBottom"
          isCentered
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

                        toggleTask(selectedTask.uuid).catch((err) => {
                          console.log(err);
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
                      setTasks((prevTasks) =>
                        prevTasks.filter((t) => t.uuid !== selectedTask.uuid)
                      );
                      closeTaskModal();
                      deleteTask(selectedTask.uuid).catch((err) => {
                        console.log(err);
                      });
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
                      if (submittedEdit !== null) {
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
                                description: editDescriptionInput,
                              };
                            } else {
                              return t;
                            }
                          })
                        );

                        updateTask(taskUpdateName).catch((err) => {
                          console.log(err);
                        });
                        e.stopPropagation();

                        // submit the edited name
                        setEditName(false);
                        const taskUpdateDesc: TaskUpdateInput = {
                          task_uuid: selectedTask.uuid,
                          action: TaskAction.RenameTask,
                          NewName: editNameInput,
                        };

                        setTasks((prevTasks) =>
                          prevTasks.map((t) => {
                            if (t.uuid === selectedTask.uuid) {
                              return {
                                ...t,
                                name: editNameInput,
                              };
                            } else {
                              return t;
                            }
                          })
                        );

                        updateTask(taskUpdateDesc).catch((err) => {
                          console.log(err);
                        });

                        setSubmittedEdit(true);
                        setSaveChanges(false);
                        setIsOpenTaskModal(false);
                      } else if (editDescription) {
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
                                description: editDescriptionInput,
                              };
                            } else {
                              return t;
                            }
                          })
                        );

                        updateTask(taskUpdateName).catch((err) => {
                          console.log(err);
                        });
                        e.stopPropagation();

                        setSubmittedEdit(true);
                        setSaveChanges(false);
                        setIsOpenTaskModal(false);
                      } else if (editName) {
                        // submit the edited name
                        setEditName(false);
                        const taskUpdateDesc: TaskUpdateInput = {
                          task_uuid: selectedTask.uuid,
                          action: TaskAction.RenameTask,
                          NewName: editNameInput,
                        };

                        setTasks((prevTasks) =>
                          prevTasks.map((t) => {
                            if (t.uuid === selectedTask.uuid) {
                              return {
                                ...t,
                                name: editNameInput,
                              };
                            } else {
                              return t;
                            }
                          })
                        );

                        updateTask(taskUpdateDesc).catch((err) => {
                          console.log(err);
                        });
                      }
                      setSubmittedEdit(true);
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
              <Button ref={saveChangesRef}>Save</Button>
              <Button>Discard</Button>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          hidden={isLargerThan768}
          variant={"mobile_add_button"}
          onClick={() => {
            setNewTaskModal(newTaskModal + 1);
          }}
          borderRadius="full"
        >
          <FaPlus size={"30px"} />
        </Button>
      </Box>
    </>
  );
}
