import React, { useState, type FC, useRef } from "react";
import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  Heading,
  Input,
  Textarea,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  type TaskToCreate,
  type Task,
  createTask,
} from "~/api-consume/client/task";

import { v4 as uuidv4 } from "uuid";

interface NewTaskModalProps {
  bg: string;
  fg: string;
  orange: string;
  boardUUID: string;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isOpenTaskModal: boolean;
  newTaskModal: number;
}

export const NewTaskModal: FC<NewTaskModalProps> = ({
  bg,
  fg,
  orange,
  boardUUID,
  setTasks,
  isOpenTaskModal,
  newTaskModal,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();

  const [taskInput, setTaskInput] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const handleCreateTask = async () => {
    if (taskInput.trim() !== "") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const taskUUID = uuidv4();
      const taskDataInput: TaskToCreate = {
        name: taskInput,
        description: taskDescription,
        uuid: taskUUID,
        board_uuid: boardUUID,
      };

      const addTask: Task = {
        uuid: taskDataInput.uuid,
        name: taskDataInput.name,
        description: taskDataInput.description,
        board_uuid: taskDataInput.board_uuid,
        completed: false,
        user_uuid: `${Math.floor(Math.random() * 1000000)}`,
      };
      setTasks((tasks: Array<Task>) => [...tasks, addTask]);
      setTaskInput("");
      setTaskDescription("");
      await createTask(taskDataInput);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        /^[a-zA-Z]$/.test(e.key) &&
        e.key !== "Tab" &&
        !isOpen &&
        !isOpenTaskModal
      ) {
        onOpen();
        inputRef.current?.focus();
      }
    };

    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };

    if (typeof document !== "undefined") {
      document.addEventListener("keydown", handleDocumentKeyDown);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("keydown", handleDocumentKeyDown);
      }
    };
  }, [isOpen, isOpenTaskModal, onOpen, inputRef]);

  const [prevValue, setPrevValue] = useState(0);
  useEffect(() => {
    if (newTaskModal !== prevValue) {
      setPrevValue(newTaskModal);
      onOpen();
      inputRef.current?.focus();
    }
  }, [newTaskModal, onOpen, prevValue, setPrevValue, inputRef]);
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={inputRef}
      onClose={onClose}
      isOpen={isOpen}
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
          maxLength={190}
          onChange={(e) => {
            setTaskInput(e.target.value);
          }}
          placeholder="Name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClose();
              handleCreateTask().catch((err) => {
                console.log(err);
              });
            }
          }}
        />
        <Textarea
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
              onClose();
              handleCreateTask().catch((err) => {
                console.log(err);
              });
              setTaskDescription("");
            }
          }}
        />
        <Button
          m={3}
          maxW={500}
          _hover={{ bg: `${bg}3` }}
          _active={{ bg: `${bg}1` }}
          color={`${fg}2`}
          bg={`${bg}2`}
          tabIndex={2}
          w="full"
          onClick={() => {
            onClose();
            handleCreateTask().catch((err) => {
              console.log(err);
            });
          }}
        >
          Add task
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewTaskModal;
