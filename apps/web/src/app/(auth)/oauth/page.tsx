"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { FullPageLoader } from "@/components/views/FullPageLoader";
import { formatAPIQueryKey } from "@/lib/api/formatQueryKey";
import { useAPI } from "@/providers/APIProvider";

export default function LoginPage() {
    const queryClient = useQueryClient();
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
        queryKey: formatAPIQueryKey(
            "live.atcast.auth.createSession",
            searchParams,
        ),
        queryFn: async () => {
            const res = await api.client.live.atcast.auth.createSession({
                iss: searchParams.get("iss")!,
                state: searchParams.get("state")!,
                code: searchParams.get("code")!,
            });

            await queryClient.invalidateQueries({
                queryKey: formatAPIQueryKey("com.atproto.server.getSession"),
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

    return <FullPageLoader />;
}
