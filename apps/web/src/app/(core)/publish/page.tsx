"use client";

import { AtUri } from "@atproto/api";
import { yupResolver } from "@hookform/resolvers/yup";
import stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

import { Form } from "@/components/Form";
import { useAPI } from "@/providers/APIProvider";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { sizes } from "@/styles/sizes.stylex";

const formSchema = object({
    title: string().required(),
    description: string().required(),
});

type FormValues = InferType<typeof formSchema>;

export default function PublishPage() {
    const router = useRouter();
    const api = useAPI();

    const form = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            title: "Pilot",
            description: "The first episode of my new show.",
        },
    });

    const onSubmit = async (values: FormValues) => {
        if (!api.session) {
            return;
        }

        const newRecord = await api.client.live.atcast.show.episode.create(
            {
                repo: api.session.did,
            },
            {
                ...values,
                publishedAt: new Date().toISOString(),
            },
        );

        const uri = new AtUri(newRecord.uri);
        const id = uri.rkey;

        router.push(`/publish/${id}`);
    };

    useEffect(() => {
        router.prefetch("/publish/[id]");
    }, []);

    return (
        <div {...stylex.props(styles.container)}>
            <Form
                form={form}
                submitHandler={onSubmit}
                {...stylex.props(styles.form)}
            >
                <h2>Publish an Episode</h2>

                <Form.Input name="title" label="Title" />
                <Form.TextArea name="description" label="Description" />

                <p {...stylex.props(styles.uploadNotice)}>
                    You can upload your audio in the next step
                </p>

                <Form.Button size="md" color="primary">
                    Create Episode
                </Form.Button>
            </Form>
        </div>
    );
}

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: sizes.spacing4,
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing4,
        maxWidth: sizes.screenMd,
        width: "100%",
    },

    uploadNotice: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        color: colours.gray500,
        textAlign: "center",
    },
});
