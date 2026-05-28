import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        expo(),
    ],
    //   account: {
    //     accountLinking: {
    //       enabled: true,
    //       trustedProviders: ["google"], // 👈 Tells Better Auth to automatically link Google accounts
    //     },
    //   },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
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
