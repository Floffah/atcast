"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import OAuthLoading from "@/app/(auth)/oauth/loading";
import { useAPI } from "@/providers/APIProvider";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const api = useAPI();

    const isValidParams =
        searchParams.has("iss") &&
        searchParams.has("state") &&
        searchParams.has("code") &&
        typeof window !== "undefined" &&
        window.location.hostname !== "127.0.0.1";

    const finishAuthQuery = useQuery({
        queryKey: ["live.atcast.auth.finishSession", searchParams],
        queryFn: async () => {
            const res = await api.client.live.atcast.auth.createSession({
                iss: searchParams.get("iss")!,
                state: searchParams.get("state")!,
                code: searchParams.get("code")!,
            });
            return res.data as { token: string };
        },
        enabled: isValidParams,
        retry: false,
    });

    useEffect(() => {
        router.prefetch("/");

        if (window.location.hostname === "127.0.0.1") {
            window.location.hostname = "localhost";
        } else if (!isValidParams) {
            router.push("/");
        }

        if (finishAuthQuery.isSuccess && finishAuthQuery.data) {
            router.push("/");
        }
    }, [
        finishAuthQuery.data,
        finishAuthQuery.isSuccess,
        isValidParams,
        router,
    ]);

    return <OAuthLoading />;
}
