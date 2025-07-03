import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  userId: string;
  token: string;
};

type FlashData = {
  error: string;
};

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  FlashData
>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["super-secret"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
