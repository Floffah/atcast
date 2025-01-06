import { redirect } from "next/navigation";

import LoginForm from "@/app/LoginForm";

export default async function RootPage({ searchParams }: any) {
    const params = await searchParams;

    if ("iss" in params && "state" in params && "code" in params) {
        return redirect(`/oauth?${new URLSearchParams(params).toString()}`);
    }

    return <LoginForm />;
}
