/* eslint-disable @typescript-eslint/no-unused-vars */
import { theme } from "../_app";
import { useColorModeValue, ColorModeScript, Box } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import {
  getAllUserTasks,
  createTask,
  deleteTask,
  updateTask,
  type TaskUpdateInput,
  type TaskToCreate,
  type TaskAction,
  type Task,
} from "../../api-consume/client/task";

import {
  authenticateUser,
  deleteUser,
  createUser,
  type User,
} from "../../api-consume/client/user";

export default function Todo() {
  const bg = useColorModeValue("brand.light.bg", "brand.dark.bg");
  const fg = useColorModeValue("brand.light.fg", "brand.dark.fg");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

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
  // Initialize state

  useEffect(() => {
    fetch_initial_data();
  });

  // mock task data

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
      ></Box>
    </>
  );
}
