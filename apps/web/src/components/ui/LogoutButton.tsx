"use client";

import { useQueryClient } from "@tanstack/react-query";

import { logout } from "@/actions/logout";
import { Button } from "@/components/Button";

export function LogoutButton() {
    const queryClient = useQueryClient();

    return (
        <Button
            size="md"
            color="secondary"
            onClick={async () => {
                await logout();

                await queryClient.invalidateQueries();
            }}
        >
            Logout
        </Button>
    );
}
