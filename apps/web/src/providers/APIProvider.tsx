"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";

import { AtpBaseClient, ComAtprotoServerGetSession } from "@atcast/atproto";

import { createBskyClient } from "@/lib/api/bskyClient";
import { formatQueryKey } from "@/lib/api/formatQueryKey";
import { createXRPCClient } from "@/lib/api/xrpcClient";

interface APIClientContextValue {
    client: AtpBaseClient;
    atprotoClient: ReturnType<typeof createBskyClient>;
    session?: ComAtprotoServerGetSession.OutputSchema;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const APIClientContext = createContext<APIClientContextValue>(null!);

export const useAPI = () => useContext(APIClientContext);

export function APIProvider({ children }: PropsWithChildren) {
    const client = useMemo(() => createXRPCClient(), []);
    const atprotoClient = useMemo(() => createBskyClient(), []);

    const sessionQuery = useQuery({
        queryKey: formatQueryKey("com.atproto.server.getSession"),
        queryFn: () => client.com.atproto.server.getSession(),
        staleTime: 1000 * 60 * 5,
    });

    return (
        <APIClientContext.Provider
            value={{
                client,
                atprotoClient,
                session: sessionQuery.data?.data,
                isLoading: sessionQuery.isLoading,
                isAuthenticated:
                    sessionQuery.isSuccess && !!sessionQuery.data?.data?.active,
            }}
        >
            {children}
        </APIClientContext.Provider>
    );
}
