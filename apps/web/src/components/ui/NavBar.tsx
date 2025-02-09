import stylex from "@stylexjs/stylex";
import { Suspense } from "react";

import { Link } from "@/components/Link";
import { Loader } from "@/components/Loader";
import { AuthButton } from "@/components/ui/AuthButton";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { sizes } from "@/styles/sizes.stylex";
import { theme } from "@/styles/theme.stylex";

export function NavBar() {
    return (
        <nav {...stylex.props(styles.container)}>
            <Link
                colour="inherit"
                href="/home"
                {...stylex.props(styles.brandName)}
            >
                AtCast
            </Link>

            <div {...stylex.props(styles.links)}>
                <Suspense fallback={<Loader />}>
                    <AuthButton />
                </Suspense>
            </div>
        </nav>
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
        fontWeight: fontWeights.bold,
    },
    links: {
        display: "flex",
        flexDirection: "row",
        gap: sizes.spacing2,
        alignItems: "center",
    },
});
