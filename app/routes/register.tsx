import { Form, useActionData } from "@remix-run/react";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { registerUser } from "~/api/auth";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();

  const payload = {
    name: form.get("name") as string,
    email: form.get("email") as string,
    password: form.get("password") as string,
    password_confirmation: form.get("password_confirmation") as string,
  };

  try {
    await registerUser(payload);
    return redirect("/login");
  } catch (error: any) {
    return json({ error: error.message }, { status: 422 });
  }
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <Form method="post" className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          required
          className="w-full border px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full border px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full border px-3 py-2"
        />
        <input
          name="password_confirmation"
          type="password"
          placeholder="Confirm Password"
          required
          className="w-full border px-3 py-2"
        />
        {actionData?.error && (
          <p className="text-red-500 text-sm">{actionData.error}</p>
        )}
        <button type="submit" className="bg-green-600 text-white px-4 py-2">
          Register
        </button>
      </Form>
    </div>
  );
}
