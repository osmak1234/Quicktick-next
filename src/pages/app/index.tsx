import { theme } from "../_app";
import {
  useColorModeValue,
  ColorModeScript,
  Box,
  Heading,
  Button,
  Text,
  Input,
  Spacer,
  VStack,
  HStack,
} from "@chakra-ui/react";

import { v4 as uuidv4 } from "uuid";

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

import {
  authenticateUser,
  deleteUser,
  createUser,
  type User,
} from "../../api-consume/client/user";

import { BsXSquare, BsX, BsSquare, BsPencilSquare } from "react-icons/bs";

export default function Todo() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");
  const orange = useColorModeValue("brand.light.orange", "brand.dark.orange");

  // fetch the user name
  const [user, setUser] = useState<User | null>(null);

  const getUserData = useCallback(() => {
    console.log("getting user data");
    console.log(document.cookie);
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
  const [force_refetch, setForceRefetch] = useState(false); // Used to force a refetch of data from the server
  const [taskInput, setTaskInput] = useState("");

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

  document.onkeydown = function (e) {
    if (e.key !== "Escape") {
      inputRef.current?.focus();
    }
  };

  // Initialize state
  useEffect(() => {
    fetch_initial_data();
  }, [force_refetch]);

  const handleCreateTask = async () => {
    console.log("creating task");
    if (taskInput.trim() !== "") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const taskUUID = uuidv4();
      const taskInput: TaskToCreate = {
        name: "Create task",
        description: "create task desc",
        uuid: taskUUID,
      };
      const newTask = await createTask(taskInput);

      const addTask: Task = {
        uuid: taskInput.uuid,
        name: taskInput.name,
        description: taskInput.description,
        completed: false,
        user_uuid: `${Math.floor(Math.random() * 1000000)}`,
      };
      setTasks([...tasks, addTask]);
      setTaskInput("");
    }
  };

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box
        bg={bg}
        color={fg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
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
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Enter task name"
            />
            <Button
              m={3}
              maxW={500}
              _hover={{ bg: `${bg}3` }}
              _active={{ bg: `${bg}1` }}
              color={`${fg}2`}
              bg={`${bg}2`}
              w="full"
              onClick={() => {
                console.log("CLICKED");
                handleCreateTask().catch((err) => {
                  console.log(err);
                });
              }}
            >
              Add task
            </Button>
            {tasks.map((task) => (
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
                    console.log("deleting task");
                  }}
                >
                  <BsX size={"30px"} />
                </Button>
              </Box>
            ))}
          </>
        )}
      </Box>
    </>
  );
}
