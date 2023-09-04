import { handle_error } from "../helper";

export interface Task {
  uuid: string;
  name: string;
  description: string;
  completed: boolean;
  user_uuid: string;
  board_uuid: string;
}

export interface TaskToCreate {
  name: string;
  description: string;
  uuid: string;
  board_uuid: string;
}

export async function getAllUserTasks(): Promise<Task[]> {
  const response = await fetch(
    "https://quicktick-api.fly.dev/get/all_user_tasks",
    {
      method: "GET",
      headers: {
        origin: "https://quicktick-next.vercel.app",
      }, //
      credentials: "include",
    }
  );

  await handle_error(response);
  const tasks: Task[] = (await response.json()) as Task[];
  return tasks;
}

export async function createTask(
  taskData: TaskToCreate,
  device: string
): Promise<void> {
  const response = await fetch(
    `https://quicktick-api.fly.dev/post/create_task?device_identifier=${device}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
      credentials: "include",
    }
  );

  await handle_error(response);

  return;
}

export async function getBoardTasks(boardId: string): Promise<Task[]> {
  const response = await fetch(
    `https://quicktick-api.fly.dev/get/all_board_tasks/${boardId}`,
    {
      method: "GET",
      headers: {
        origin: "https://quicktick-next.vercel.app",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  await handle_error(response);

  const tasks: Task[] = (await response.json()) as Task[];
  return tasks;
}

export async function deleteTask(
  taskId: string,
  device: string
): Promise<void> {
  const response = await fetch(
    `https://quicktick-api.fly.dev/delete/task/${taskId}?device_identifier=${device}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  await handle_error(response);

  return;
}

export enum TaskAction {
  RenameTask = "RenameTask",
  ChangeDesc = "ChangeDesc",
  ToggleTask = "ToggleTask",
  ChangeOrder = "ChangeOrder",
  MoveBoard = "MoveBoard",
}

export interface TaskUpdateInput {
  task_uuid: string;
  action: TaskAction;
  NewName?: string;
  NewDesc?: string;
  ChangeOrder?: number;
  NewBoard?: string;
}

export async function updateTask(
  updateData: TaskUpdateInput,
  device: string
): Promise<void> {
  const response = await fetch(
    `https://quicktick-api.fly.dev/patch/task?device_identifier=${device}`,
    {
      method: "PATCH",
      headers: {
        origin: "https://quicktick-next.vercel.app",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
      credentials: "include",
    }
  );

  await handle_error(response);

  return;
}
