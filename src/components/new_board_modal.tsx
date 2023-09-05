import React, { useState, type FC, useRef } from "react";
import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  Heading,
  Input,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { v4 as uuidv4 } from "uuid";
import {
  type Board,
  type BoardToCreate,
  createBoard,
} from "~/api-consume/client/board";

interface NewTaskModalProps {
  bg: string;
  fg: string;
  orange: string;
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  isOpenBoardModal: boolean;
  newBoardModal: number;
  device: string;
}

export const NewBoardModal: FC<NewTaskModalProps> = ({
  bg,
  fg,
  orange,
  setBoards,
  isOpenBoardModal,
  newBoardModal,
  device,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();

  const [boardInput, setBoardInput] = useState("");

  const handleCreateBoard = async () => {
    if (boardInput.trim() !== "") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const boardUUID = uuidv4();
      const boardDataInput: BoardToCreate = {
        name: boardInput,
        uuid: boardUUID,
      };

      const addBoard: Board = {
        uuid: boardDataInput.uuid,
        name: boardDataInput.name,
        user_uuid: `${Math.floor(Math.random() * 1000000)}`,
      };
      setBoards((boards: Array<Board>) => [...boards, addBoard]);
      setBoardInput("");
      await createBoard(boardDataInput, device);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        /^[a-zA-Z]$/.test(e.key) &&
        e.key !== "Tab" &&
        !isOpen &&
        !isOpenBoardModal
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
  }, [isOpen, isOpenBoardModal, onOpen, inputRef]);

  const [prevValue, setPrevValue] = useState(0);
  useEffect(() => {
    if (newBoardModal !== prevValue) {
      setPrevValue(newBoardModal);
      onOpen();
      inputRef.current?.focus();
    }
  }, [newBoardModal, onOpen, prevValue, setPrevValue, inputRef]);
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
          New Board
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
          value={boardInput}
          maxLength={190}
          onChange={(e) => {
            setBoardInput(e.target.value);
          }}
          placeholder="Name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClose();
              handleCreateBoard().catch((err) => {
                console.log(err);
              });
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
            handleCreateBoard().catch((err) => {
              console.log(err);
            });
          }}
        >
          Create board
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewBoardModal;
