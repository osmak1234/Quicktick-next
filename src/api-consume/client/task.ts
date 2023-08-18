import { handle_error } from "../helper";

export interface Task {
  uuid: string;
  name: string;
  description: string;
  completed: boolean;
  user_uuid: string;
}

export interface TaskToCreate {
  name: string;
  description: string;
  uuid: string;
}

export async function getAllUserTasks(): Promise<Task[]> {
  const response = await fetch(
    "https://quicktick-api.fly.dev/get/all_user_tasks_cauth",
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

export async function createTask(taskData: TaskToCreate): Promise<void> {
  const response = await fetch(
    "https://quicktick-api.fly.dev/post/create_task_cauth",
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

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(
    `https://quicktick-api.fly.dev/delete/task_cauth/${taskId}`,
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
}

export interface TaskUpdateInput {
  task_uuid: string;
  action: TaskAction;
  NewName?: string;
  NewDesc?: string;
  ChangeOrder?: number;
}

export async function updateTask(updateData: TaskUpdateInput): Promise<void> {
  const response = await fetch("https://quicktick-api.fly.dev/patch/task", {
    method: "PATCH",
    headers: {
      origin: "https://quicktick-next.vercel.app",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
    credentials: "include",
  });

  await handle_error(response);

  return;
}
