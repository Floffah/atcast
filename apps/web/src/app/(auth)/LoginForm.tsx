"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

import { Form } from "@/components/Form";
import { useXRPCClient } from "@/providers/XRPCClientProvider";
import { sizes } from "@/styles/sizes.stylex";
import BlueskyIcon from "~icons/ri/bluesky-fill";

const formSchema = object({
    handle: string().required(),
});
type FormValues = InferType<typeof formSchema>;

export default function LoginForm() {
    const router = useRouter();

    const xrpc = useXRPCClient();

    const form = useForm<FormValues>({
        resolver: yupResolver(formSchema),
    });

    const onSubmit = async (values: FormValues) => {
        try {
            const res = await xrpc.live.atcast.auth.getAuthUrl({
                handle: values.handle,
            });

            if (res.data?.url) {
                router.push(res.data.url);
            }
        } catch (e: any) {
            if (typeof e.message === "string") {
                form.setError("handle", {
                    type: "manual",
                    message: e.message,
                });
            }
        }
    };

    return (
        <div {...stylex.props(styles.container)}>
            <Form
                form={form}
                submitHandler={onSubmit}
                {...stylex.props(styles.loginForm)}
            >
                <Form.Input name="handle" placeholder="Bluesky Handle" />
                <Form.Button size="md" color="primary" icon={BlueskyIcon}>
                    Login
                </Form.Button>
            </Form>
        </div>
    );
}

const styles = stylex.create({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: sizes.h_screen,
    },
    loginForm: {
        display: "flex",
        alignItems: "center",
        gap: sizes.spacing2,
    },
});
