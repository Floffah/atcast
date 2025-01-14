"use client";

import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";

import { AtpBaseClient, ComAtprotoServerGetSession } from "@atcast/atproto";

import { createBskyClient } from "@/lib/api/bskyClient";
import { createXRPCClient } from "@/lib/api/xrpcClient";

interface XRPCClientContextValue {
    client: AtpBaseClient;
    atprotoClient: ReturnType<typeof createBskyClient>;
    session?: ComAtprotoServerGetSession.OutputSchema;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const XRPCClientContext = createContext<XRPCClientContextValue>(null!);

export const useAPI = () => useContext(XRPCClientContext);

export function XRCPClientProvider({ children }: PropsWithChildren) {
    const client = useMemo(() => createXRPCClient(), []);
    const atprotoClient = useMemo(() => createBskyClient(), []);
    const queryClient = useMemo(() => new QueryClient(), []);

    const sessionQuery = useQuery(
        {
            queryKey: ["com.atproto.server.getSession"],
            queryFn: () => client.com.atproto.server.getSession(),
        },
        queryClient,
    );

    return (
        <XRPCClientContext.Provider
            value={{
                client,
                atprotoClient,
                session: sessionQuery.data?.data,
                isLoading: sessionQuery.isLoading,
                isAuthenticated:
                    sessionQuery.isSuccess && !!sessionQuery.data?.data?.active,
            }}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </XRPCClientContext.Provider>
    );
}
