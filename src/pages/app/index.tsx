import { theme } from "../_app";
import {
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
  ColorModeScript,
  Box,
  Heading,
  Button,
  Text,
  Input,
  Spacer,
  VStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
} from "@chakra-ui/react";

import { v4 as uuidv4 } from "uuid";

import React from "react";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getAllUserTasks,
  createTask,
  deleteTask,
  updateTask,
  TaskAction,
  type Task,
  type TaskUpdateInput,
  type TaskToCreate,
} from "../../api-consume/client/task";

import { authenticateUser, type User } from "../../api-consume/client/user";

import { BsXSquare, BsX, BsSquare, BsPencilSquare } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import autoAnimate from "@formkit/auto-animate";

export default function Todo() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");
  const orange = useColorModeValue("brand.light.orange", "brand.dark.orange");

  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  // fetch the user name
  const [user, setUser] = useState<User | null>(null);

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

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
  const [taskInput, setTaskInput] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const {
    isOpen: isOpenInput,
    onOpen: onOpenInput,
    onClose: onCloseInput,
  } = useDisclosure();

  const cancelRef = useRef(null);

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

  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key) && e.key !== "Tab") {
        onOpenInput();
        inputRef.current?.focus();
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [onOpenInput]);

  // Initialize state
  useEffect(() => {
    fetch_initial_data();
  }, []);

  const handleCreateTask = async () => {
    console.log("creating task");
    if (taskInput.trim() !== "") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const taskUUID = uuidv4();
      const taskDataInput: TaskToCreate = {
        name: taskInput,
        description: "",
        uuid: taskUUID,
      };

      const addTask: Task = {
        uuid: taskDataInput.uuid,
        name: taskDataInput.name,
        description: taskDataInput.description,
        completed: false,
        user_uuid: `${Math.floor(Math.random() * 1000000)}`,
      };
      setTasks([...tasks, addTask]);
      setTaskInput("");
      await createTask(taskDataInput);
    }
  };

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
        onKeyDown={(e) => {
          if (e.key !== "Enter") {
            inputRef.current?.focus();
          }
        }}
      >
        <Heading as="h1" size="2xl" color={fg}>
          Todo
        </Heading>
        {!user ? (
          <Text>Not logged in</Text>
        ) : (
          <>
            <AlertDialog
              motionPreset="slideInBottom"
              leastDestructiveRef={cancelRef}
              onClose={onCloseInput}
              isOpen={isOpenInput}
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
                <Heading as="h2" size="lg" color={`${fg}_h`} pb={4}>
                  New Task
                </Heading>
                <Input
                  autoFocus={true}
                  ref={inputRef}
                  w="full"
                  maxW={500}
                  m={3}
                  borderColor={`${bg}2`}
                  color={`${fg}_h`}
                  bg={`${bg}_h`}
                  borderWidth={2}
                  focusBorderColor={orange}
                  value={taskInput}
                  onChange={(e) => {
                    setTaskInput(e.target.value);
                  }}
                  placeholder="Name"
                  // on keypress enter, create task
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onCloseInput();
                      handleCreateTask().catch((err) => {
                        console.log(err);
                      });
                    }
                  }}
                />
                <Input
                  w="full"
                  maxW={500}
                  m={3}
                  tabIndex={1}
                  borderColor={`${bg}2`}
                  color={`${fg}_h`}
                  bg={`${bg}_h`}
                  borderWidth={2}
                  focusBorderColor={orange}
                  value={taskDescription}
                  onChange={(e) => {
                    setTaskDescription(e.target.value);
                  }}
                  placeholder="Description (optional)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onCloseInput();
                      handleCreateTask().catch((err) => {
                        console.log(err);
                      });
                    } else if (e.key === "Tab") {
                      e.preventDefault();
                      submitRef.current?.focus();
                    }
                  }}
                />
                <Button
                  m={3}
                  maxW={500}
                  ref={submitRef}
                  _hover={{ bg: `${bg}3` }}
                  _active={{ bg: `${bg}1` }}
                  color={`${fg}2`}
                  bg={`${bg}2`}
                  tabIndex={2}
                  w="full"
                  onClick={() => {
                    onCloseInput();
                    handleCreateTask().catch((err) => {
                      console.log(err);
                    });
                  }}
                >
                  Add task
                </Button>
              </AlertDialogContent>
            </AlertDialog>
            {isLargerThan768 ? "Start typing to add a task" : ""}
            {tasks
              .sort((a, b) => Number(a.completed) - Number(b.completed))
              .map((task) => (
                <Box
                  w="full"
                  maxW={500}
                  key={task.uuid}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  bg={`${bg}_h`}
                  p={4}
                  borderRadius="md"
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
                    onClick={() => {
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
                    <Text fontWeight="bold" color={`${fg}_h`}>
                      {task.name}
                    </Text>
                    <Text color={`${fg}_h`}>{task.description}</Text>
                  </VStack>
                  <Spacer />
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
                    onClick={() => {
                      console.log("Modifying task");
                    }}
                  >
                    <BsPencilSquare size={"20px"} />
                  </Button>
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
                    onClick={() => {
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
        <Button
          hidden={isLargerThan768}
          color={fg}
          aria-label="add task mobile"
          position="fixed"
          bottom={4}
          right={4}
          size="lg"
          style={{
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
            borderRadius: "50%",
          }}
          _hover={{
            bg: `brand.dark.orange`,
            _dark: { bg: `brand.light.orange` },
          }}
          py="30px"
          px={4}
          bg="brand.dark.orange"
          _dark={{ bg: "brand.dark.orange" }}
          onClick={onOpenInput}
        >
          <FaPlus size={"30px"} />
        </Button>
      </Box>
    </>
  );
}
