import { redirect } from "next/navigation";

export default async function RootPage({ searchParams }) {
    const params = await searchParams;

    if ("iss" in params && "state" in params && "code" in params) {
        return redirect(
            `/login/oauth?${new URLSearchParams(params).toString()}`,
        );
    }

    return <></>;
}
