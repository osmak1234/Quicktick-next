import React, { type FC } from "react";
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

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  bg: string;
  fg: string;
  orange: string;
  taskInput: string;
  setTaskInput: React.Dispatch<React.SetStateAction<string>>;
  taskDescription: string;
  setTaskDescription: React.Dispatch<React.SetStateAction<string>>;
  handleCreateTask: () => Promise<void>;
}

export const NewTaskModal: FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  inputRef,
  bg,
  fg,
  orange,
  taskInput,
  setTaskInput,
  taskDescription,
  setTaskDescription,
  handleCreateTask,
}) => {
  const {
    isOpen: isOpenInput,
    onOpen: onOpenInput,
    onClose: onCloseInput,
  } = useDisclosure();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        /^[a-zA-Z]$/.test(e.key) &&
        e.key !== "Tab" &&
        !isOpenInput &&
        !isOpenTaskModal
      ) {
        onOpenInput();
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
  }, [isOpenInput, isOpenTaskModal, onOpenInput]);
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
