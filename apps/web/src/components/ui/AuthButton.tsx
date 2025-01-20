import { Button } from "@/components/Button";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { getSessionFromRuntime } from "@/lib/server/data/getSession";

export async function AuthButton() {
    const { session } = await getSessionFromRuntime();

    if (session) {
        return <LogoutButton />;
    } else {
        return (
            <Button size="md" color="secondary" link="/">
                Login
            </Button>
        );
    }
}
