import stylex from "@stylexjs/stylex";
import clsx from "clsx";

export function composeStyles(
    props: ReturnType<typeof stylex.props>,
    className: string = "",
) {
    return {
        ...props,
        className: clsx(className, props.className),
    };
}
