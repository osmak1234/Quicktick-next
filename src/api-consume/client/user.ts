import { handle_error } from "../helper";

export interface User {
  name: string;
  email: string;
  password: string;
}

export async function createUser(userData: User): Promise<Response> {
  const response = await fetch(
    "https:/quicktick-api.fly.dev/post/create_user",
    {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",

        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    }
  );

  await handle_error(response);

  return response;
}

export async function logout(): Promise<void> {
  const response = await fetch("https:/quicktick-api.fly.dev/logout", {
    method: "GET",
    credentials: "include",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

  await handle_error(response);

  return;
}

export async function deleteUser(): Promise<void> {
  const response = await fetch(
    "https://quicktick-api.fly.dev/delete/user_cauth",
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );

  await handle_error(response);

  return;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | void> {
  const response = await fetch(
    `https://quicktick-api.fly.dev/login/${email}/${password}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );

  await handle_error(response);

  if (email === "cookie" && password === "cookie") {
    const user: User = (await response.json()) as User;
    return user;
  }
  return;
}
