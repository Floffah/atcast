import { RedirectType, redirect } from "next/navigation";

import LoginForm from "@/app/(auth)/LoginForm";
import { getSessionFromRuntime } from "@/lib/server/data/getSession";

// TOOD: replace landing page with static-only page with no server logic

export default async function RootPage({ searchParams }: any) {
    const params = await searchParams;

    if ("iss" in params && "state" in params && "code" in params) {
        return redirect(
            `/oauth?${new URLSearchParams(params).toString()}`,
            RedirectType.push,
        );
    }

    const { session } = await getSessionFromRuntime();

    if (session) {
        return redirect("/home");
    }

    return <LoginForm />;
}
