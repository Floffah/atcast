"use client";

import { serialize } from "cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { SESSION_TOKEN } from "@/lib/constants";

export function CloseTab(props: { sessionToken: string; expires: number }) {
    const router = useRouter();

    useEffect(() => {
        document.cookie = serialize(SESSION_TOKEN, props.sessionToken, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            domain:
                process.env.NODE_ENV === "production"
                    ? "atcast.floffah.dev"
                    : "localhost",
            sameSite: "strict",
            expires: new Date(props.expires),
        });

        router.replace("/");
    }, []);

    return <p>You can safely close this tab.</p>;
}
