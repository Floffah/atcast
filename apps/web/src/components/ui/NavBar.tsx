import stylex from "@stylexjs/stylex";

import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { sizes } from "@/styles/sizes.stylex";
import { theme } from "@/styles/theme.stylex";

export function NavBar() {
    return (
        <div {...stylex.props(styles.container)}>
            <h1 {...stylex.props(styles.brandName)}>AtCast</h1>

            <div></div>
        </div>
    );
}

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: `${sizes.spacing3} ${sizes.spacing5}`,
        borderBottom: `1px solid ${theme.secondaryBackground}`,
    },
    brandName: {
        fontSize: fontSizes["2xl"],
        lineHeight: lineHeights["2xl"],
        color: theme.primaryForeground,
    },
});
