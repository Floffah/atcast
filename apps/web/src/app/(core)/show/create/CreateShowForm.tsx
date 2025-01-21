"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

import { Form } from "@/components/Form";
import { useAPI } from "@/providers/APIProvider";
import { sizes } from "@/styles/sizes.stylex";

const formSchema = object({
    name: string().max(256).required(),
    description: string().max(1024),
});
type FormValues = InferType<typeof formSchema>;

export function CreateShowForm() {
    const router = useRouter();
    const api = useAPI();

    const form = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            name: "My Show",
        },
    });

    const onSubmit = async (data: FormValues) => {
        if (!api.session) {
            return;
        }

        try {
            await api.client.live.atcast.podcast.show.create(
                {
                    repo: api.session.did,
                },
                {
                    name: data.name,
                    description: data.description,
                },
            );
        } catch (e: any) {
            console.error(e);

            const message = e.message ?? "An error occurred";

            form.setError("name", {
                type: "manual",
                message,
            });

            return;
        }

        router.push("/home");
    };

    return (
        <Form
            form={form}
            submitHandler={onSubmit}
            {...stylex.props(styles.form)}
        >
            <h1>Create Show</h1>

            <Form.Input name="name" label="Name" placeholder="My Show" />

            <Form.TextArea
                name="description"
                label="Description"
                placeholder="Description of your show. Short and sweet."
                minRows={3}
                maxRows={5}
            />

            <Form.Button
                size="md"
                color="primary"
                {...stylex.props(styles.submitButton)}
            >
                Create
            </Form.Button>
        </Form>
    );
}

const styles = stylex.create({
    form: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing4,
        marginTop: sizes.spacing4,
        padding: sizes.spacing2,
    },

    submitButton: {
        width: "fit-content",
        paddingLeft: sizes.spacing6,
        paddingRight: sizes.spacing6,
        alignSelf: "flex-end",
    },
});
