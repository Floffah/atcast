import stylex from "@stylexjs/stylex";
import { Suspense } from "react";

import { ActivityFeedSection } from "@/app/(core)/home/ActivityFeed";
import { ActivityFeedLoading } from "@/app/(core)/home/ActivityFeed/loading";
import { MyShowsSection } from "@/app/(core)/home/MyShowsSection";
import { MyShowsLoading } from "@/app/(core)/home/MyShowsSection/loading";
import { sizes } from "@/styles/sizes.stylex";

export default async function HomePage() {
    return (
        <main {...stylex.props(styles.container)}>
            <Suspense fallback={<MyShowsLoading />}>
                <MyShowsSection />
            </Suspense>

            <Suspense fallback={<ActivityFeedLoading />}>
                <ActivityFeedSection />
            </Suspense>
        </main>
    );
}

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: sizes.spacing2,
        gap: sizes.spacing4,
        marginTop: sizes.spacing4,
    },
});
