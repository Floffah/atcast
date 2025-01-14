import stylex from "@stylexjs/stylex";
import { PropsWithChildren } from "react";

import { NavBar } from "@/components/ui/NavBar";
import { sizes } from "@/styles/sizes.stylex";

export default function CoreLayout({ children }: PropsWithChildren) {
    return (
        <div {...stylex.props(styles.container)}>
            <NavBar />

            {children}
        </div>
    );
}

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: `0 ${sizes.spacing4}`,
    },
});
