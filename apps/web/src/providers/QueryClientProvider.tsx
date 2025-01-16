"use client";

import { QueryNormalizerProvider } from "@normy/react-query";
import {
    QueryClient,
    QueryClientProvider as RQQueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";

export function QueryClientProvider({ children }: PropsWithChildren) {
    const queryClient = useMemo(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                    },
                },
            }),
        [],
    );

    return (
        <QueryNormalizerProvider queryClient={queryClient}>
            <RQQueryClientProvider client={queryClient}>
                {children}
            </RQQueryClientProvider>
        </QueryNormalizerProvider>
    );
}
