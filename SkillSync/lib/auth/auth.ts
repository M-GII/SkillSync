import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { initUserBoard } from "../init-user-board";
import { mongoClient } from "@/lib/mongodb-client";

const db = mongoClient.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, { client: mongoClient }),

    trustedOrigins: [
        "https://skill-sync-gules-six.vercel.app",
    ],

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60,
        },
    },

    emailAndPassword: {
        enabled: true,
    },

    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    if (user.id) {
                        await initUserBoard(user.id);
                    }
                },
            },
        },
    },
});

export async function getSession() {
    const result = await auth.api.getSession({
        headers: await headers(),
    });

    return result;
}

export async function signOut() {
    const result = await auth.api.signOut({
        headers: await headers(),
    });

    if (result.success) {
        redirect("/login");
    }
}