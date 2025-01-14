import stylex from "@stylexjs/stylex";

import { Loader } from "@/components/Loader";
import { colours } from "@/styles/colours.stylex";
import { sizes } from "@/styles/sizes.stylex";

export function FullPageLoader() {
    return (
        <div {...stylex.props(styles.container)}>
            <Loader {...stylex.props(styles.loader)} />
        </div>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";
const styles = stylex.create({
    container: {
        display: "flex",
        minHeight: sizes.h_screen,
        width: sizes.w_screen,
        alignItems: "center",
        justifyContent: "center",
    },

    loader: {
        height: sizes.spacing6,
        width: sizes.spacing6,
        color: {
            default: colours.gray300,
            [DARK]: colours.gray700,
        },
    },
});
