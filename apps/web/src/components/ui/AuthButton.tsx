"use client";

import { Link } from "@/components/Link";
import { Loader } from "@/components/Loader";
import { useAPI } from "@/providers/APIProvider";

export function AuthButton() {
    const api = useAPI();

    if (api.isLoading) {
        return <Loader />;
    }

    if (api.isAuthenticated) {
        return (
            <Link colour="inherit" href="/logout">
                Logout
            </Link>
        );
    } else {
        return (
            <Link colour="inherit" href="/">
                Login
            </Link>
        );
    }
}
