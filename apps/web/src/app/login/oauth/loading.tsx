import { Loader } from "@/components/Loader";

export default function LoginLoading() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader className="h-6 w-6 text-gray-300 dark:text-gray-700" />
        </div>
    );
}
