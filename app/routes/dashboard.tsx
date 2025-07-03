import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "../session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const token = session.get("token");

  if (!userId || !token) {
    return redirect("/login");
  }

  const response = await fetch("http://localhost:8000/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return redirect("/login");
  }

  const data = await response.json();

  return json({ user: data.user });
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👋 Welcome, {user.name}!</h1>
        <form action="/logout" method="post">
          <button
            type="submit"
            className="text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </form>
      </div>

      <p>Your email is: {user.email}</p>
      <p className="mt-2 text-gray-500">This is your secure dashboard page.</p>
    </div>
  );
}
