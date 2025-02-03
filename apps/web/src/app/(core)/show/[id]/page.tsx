import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublicShowData } from "@/lib/server/data/getPublicShowData";
import { populateMetadata } from "@/lib/utils/populateMetadata";

export async function generateMetadata(
    {
        params,
    }: {
        params: Promise<{ id: string }>;
    },
    parentMetadata: Promise<Metadata>,
) {
    const { id } = await params;

    const show = await getPublicShowData(id);

    if (!show) {
        return await parentMetadata;
    }

    return populateMetadata({
        title: show.show.name,
        description: `View ${show.show.name} and many more on Atcast`,
    });
}

export default async function ShowPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const show = await getPublicShowData(id);

    if (!show) {
        return notFound();
    }

    return <div>{id}</div>;
}
