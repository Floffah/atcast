"use client";

import { AtClient } from "@atcast/atproto";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";

import { createXRPCClient } from "@/lib/xrpcClient";

const XRPCClientContext = createContext<AtClient>(null!);

export const useXRPCClient = () => useContext(XRPCClientContext);

export function XRCPClientProvider({ children }: PropsWithChildren) {
    const client = useMemo(() => createXRPCClient(), []);
    const queryClient = useMemo(() => new QueryClient(), []);

    return (
        <XRPCClientContext.Provider value={client}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </XRPCClientContext.Provider>
    );
}
