"use client";

import stylex, { StyleXStyles } from "@stylexjs/stylex";
import { forwardRef } from "react";

import { Icon, IconProps } from "@/components/Icon";
import { composeStyles } from "@/lib/utils/composeStyles";
import LoadingIcon from "~icons/mdi/loading";

export const Loader = forwardRef<
    SVGSVGElement,
    Omit<IconProps, "ref" | "label" | "icon">
>(({ className, style, ...props }, ref) => {
    return (
        <Icon
            label="loading"
            icon={LoadingIcon}
            ref={ref}
            {...composeStyles(
                stylex.props(styles.base, style as StyleXStyles),
                className,
            )}
            {...props}
        />
    );
});

export const spin = stylex.keyframes({
    from: {
        transform: "rotate(0deg)",
    },
    to: {
        transform: "rotate(360deg)",
    },
});

const styles = stylex.create({
    base: {
        animationName: spin,
        animationDuration: "1s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
    },
});
