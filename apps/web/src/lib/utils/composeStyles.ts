import stylex from "@stylexjs/stylex";
import clsx from "clsx";

export function composeStyles<Style>(
    props: ReturnType<typeof stylex.props>,
    className: string = "",
    style: Style = {} as Style,
): { className: string; style: Style } {
    return {
        ...props,
        className: clsx(className, props.className),
        style: {
            ...style,
            ...props.style,
        },
    };
}
