import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { createDb } from "../db/index.js";
import * as schema from "../db/schema.js";
export function createAuth(env) {
    const db = createDb(env.DATABASE_URL);
    const expoScheme = env.EXPO_APP_SCHEME?.trim();
    const trustedOrigins = [
        env.BETTER_AUTH_URL,
        expoScheme ? `${expoScheme}://` : undefined,
        expoScheme ? `${expoScheme}://*` : undefined,
        // Expo development deep links
        "exp://",
        "exp://**",
        "exp://192.168.*.*:*/**",
    ].filter((value) => Boolean(value));
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
        trustedOrigins,
        advanced: {
            disableCSRFCheck: true,
        },
        emailAndPassword: {
            enabled: true,
        },
    });
}
