// app/routes/login.tsx
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { loginUser } from "~/api/auth";
import { getSession, commitSession } from "../session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect("/dashboard");
  }

  const error = session.get("error");

  return json(
    { error },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  try {
    const res = await loginUser({ email, password });
    session.set("userId", res.user.id);
    session.set("token", res.token);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (err: any) {
    session.flash("error", "Invalid credentials");

    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export default function LoginPage() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Form method="post" className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full border px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full border px-3 py-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Login
        </button>
      </Form>
    </div>
  );
}
