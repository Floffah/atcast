import stylex, { StyleXStyles } from "@stylexjs/stylex";
import { ComponentProps, forwardRef } from "react";

import { composeStyles } from "@/lib/utils/composeStyles";
import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { radii } from "@/styles/radii.stylex";
import { sizes } from "@/styles/sizes.stylex";
import { theme } from "@/styles/theme.stylex";

export interface InputProps extends Omit<ComponentProps<"input">, "style"> {
    error?: boolean;
    style?: StyleXStyles;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, style, error, disabled, ...props }, ref) => {
        return (
            <input
                {...props}
                ref={ref}
                disabled={disabled}
                {...composeStyles(
                    stylex.props(
                        style,
                        styles.base,
                        error && !disabled && styles.error,
                        disabled && styles.disabled,
                        error && disabled && styles.disabledError,
                    ),
                    className,
                )}
            ></input>
        );
    },
);

const styles = stylex.create({
    base: {
        transitionProperty: "color, background-color, border-color",
        transitionDuration: "150ms",
        backgroundColor: theme.controlBackground,
        borderRadius: radii.lg,
        border: {
            default: theme.controlBorder,
            ":focus": theme.controlFocusedBorder,
        },
        outline: "none",
        padding: `${sizes.spacing1} ${sizes.spacing2}`,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,
        color: {
            "::placeholder": theme.controlPlaceholderForeground,
        },
    },

    error: {
        border: theme.controlErrorBorder,
    },

    disabled: {
        color: {
            default: theme.controlDisabledForeground,
            "::placeholder": theme.controlDisabledPlaceholderForeground,
        },
        border: theme.controlDisabledBorder,
    },

    disabledError: {
        border: theme.controlDisabledErrorBorder,
    },
});
