import stylex from "@stylexjs/stylex";
import { PropsWithChildren, Suspense } from "react";

import { Loader } from "@/components/Loader";
import { NavBar } from "@/components/ui/NavBar";
import { colours } from "@/styles/colours.stylex";
import { sizes } from "@/styles/sizes.stylex";

export default function CoreLayout({ children }: PropsWithChildren) {
    return (
        <div {...stylex.props(styles.container)}>
            <NavBar />

            <Suspense fallback={<Loader {...stylex.props(styles.loader)} />}>
                {children}
            </Suspense>
        </div>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: `0 ${sizes.spacing4}`,
    },

    loader: {
        height: sizes.spacing6,
        width: sizes.spacing6,
        margin: "auto",
        color: {
            default: colours.gray300,
            [DARK]: colours.gray700,
        },
    },
});
