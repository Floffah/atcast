import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_TOKEN } from "@atcast/lib";

import LoginForm from "@/app/(auth)/LoginForm";

// TOOD: replace landing page with static-only page with no server logic

export default async function RootPage({ searchParams }: any) {
    const params = await searchParams;

    if ("iss" in params && "state" in params && "code" in params) {
        return redirect(`/oauth?${new URLSearchParams(params).toString()}`);
    }

    const reqCookies = await cookies();

    if (reqCookies.has(SESSION_TOKEN)) {
        return redirect("/home");
    }

    return <LoginForm />;
}
