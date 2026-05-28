import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { createDb } from "../db/index.js";
import * as schema from "../db/schema.js";

type AuthEnv = {
  DATABASE_URL: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
};

export function createAuth(env: AuthEnv) {
  const db = createDb(env.DATABASE_URL);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),

    baseURL: env.BETTER_AUTH_URL,
    plugins: [expo()],

    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },

    trustedOrigins: ["*"],

    advanced: {
      disableCSRFCheck: true,
    },

    emailAndPassword: {
      enabled: true,
    },
  });
}
