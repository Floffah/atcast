"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import LoginLoading from "@/app/login/oauth/loading";
import { useXRPCClient } from "@/providers/XRPCClientProvider";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const xrpcClient = useXRPCClient();

    const isValidParams =
        searchParams.has("iss") &&
        searchParams.has("state") &&
        searchParams.has("code") &&
        typeof window !== "undefined" &&
        window.location.hostname !== "127.0.0.1";

    const finishAuthQuery = useQuery({
        queryKey: ["live.atcast.auth.finishSession", searchParams],
        queryFn: async () => {
            const res = await xrpcClient.live.atcast.auth.createSessionFinish(
                searchParams.get("iss")!,
                searchParams.get("state")!,
                searchParams.get("code")!,
            );
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

    return <LoginLoading />;
}
