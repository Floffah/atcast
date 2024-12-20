"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

import BlueskyIcon from "~icons/ri/bluesky-fill";

import { Form } from "@/components/Form";
import { useXRPCClient } from "@/providers/XRPCClientProvider";

const formSchema = object({
    handle: string().required(),
});
type FormValues = InferType<typeof formSchema>;

export default function LoginPage() {
    const router = useRouter();

    const xrpc = useXRPCClient();

    const form = useForm<FormValues>({
        resolver: yupResolver(formSchema),
    });

    const onSubmit = async (values: FormValues) => {
        const res = await xrpc.live.atcast.auth.createSessionStart(
            values.handle,
        );

        if (!!res.data?.url) {
            router.push(res.data.url);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <Form
                form={form}
                submitHandler={onSubmit}
                className="flex items-center gap-2"
            >
                <Form.Input name="handle" placeholder="Bluesky Handle" />
                <Form.Button size="md" color="primary" icon={BlueskyIcon}>
                    Login
                </Form.Button>
            </Form>
        </div>
    );
}
