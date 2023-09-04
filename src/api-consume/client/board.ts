export interface Board {
  uuid: string;
  name: string;
  user_uuid: string;
  special?: number;
}

export interface BoardToCreate {
  name: string;
  uuid: string;
}

import { handle_error } from "../helper";

export async function getAllUserBoards(): Promise<Board[]> {
  const response = await fetch(
    "https://quicktick-api.fly.dev/get/all_user_board",
    {
      method: "GET",
      headers: {
        origin: "https://quicktick-next.vercel.app",
      }, //
      credentials: "include",
    }
  );

  await handle_error(response);
  const tasks: Board[] = (await response.json()) as Board[];
  return tasks;
}

export async function createBoard(
  boardData: BoardToCreate,
  device: string
): Promise<void> {
  const response = await fetch(
    `https://quicktick-api.fly.dev/post/board?device_identifier=${device}`,
    {
      method: "POST",
      headers: {
        origin: "https://quicktick-next.vercel.app",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(boardData),
      credentials: "include",
    }
  );

  await handle_error(response);

  return;
}

export async function deleteBoard(
  BoardId: string,
  device: string
): Promise<void> {
  const response = await fetch(
    `https://quicktick-api.fly.dev/delete/board/${BoardId}?device_identifier=${device}`,
    {
      headers: {
        origin: "https://quicktick-next.vercel.app",
      },
      method: "DELETE",
      credentials: "include",
    }
  );

  await handle_error(response);

  return;
}
