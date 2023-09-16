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
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@chakra-ui/react";

import { v4 as uuidv4 } from "uuid";
import {
  type Board,
  type BoardToCreate,
  createBoard,
} from "~/api-consume/client/board";

import { createPicker } from "picmo";

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
  const emojiPickerRef = useRef(null); // Reference to the emoji picker

  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();

  const [boardInput, setBoardInput] = useState("");
  const [labelInput, setLabelInput] = useState("");

  const handleCreateBoard = async () => {
    if (boardInput.trim() !== "") {
      const boardUUID = uuidv4();
      const boardDataInput: BoardToCreate = {
        name: boardInput,
        uuid: boardUUID,
        label: labelInput,
      };

      const addBoard: Board = {
        uuid: boardDataInput.uuid,
        name: boardDataInput.name,
        label: boardDataInput.label,
        user_uuid: `${Math.floor(Math.random() * 1000000)}`,
      };
      setBoards((boards: Array<Board>) => [...boards, addBoard]);
      setBoardInput("");
      setLabelInput("");
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

  // create state for the popover
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    // Get the root element
    const rootElement = document.getElementById("pickerContainer");
    // convert it to HTMLElement

    // Create the picker
    if (rootElement !== null) {
      const picker = createPicker({ rootElement });
      picker.addEventListener("emoji:select", (event) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setLabelInput(event.emoji);
        setPopoverOpen(false);
      });
    }
  }, [popoverOpen]);

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

        <HStack spacing={3} w="full">
          <Popover
            // on open create the emoji picker
            isOpen={popoverOpen}
            initialFocusRef={emojiPickerRef}
            placement="bottom"
            isLazy
          >
            <PopoverTrigger>
              <Button
                color={`${fg}_h`}
                bg={`${bg}_h`}
                _hover={{ bg: `${bg}3` }}
                _active={{ bg: `${bg}1` }}
                onClick={() => {
                  setPopoverOpen(!popoverOpen);
                }}
              >
                {labelInput === "" ? "🏷️" : labelInput}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div id="pickerContainer" />
            </PopoverContent>
          </Popover>

          <Input
            ref={inputRef}
            flex="1" // Allow the name input to expand and take up the remaining space
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
        </HStack>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewBoardModal;
