"use client";

import { Slot } from "@radix-ui/react-slot";
import stylex, { StyleXStyles } from "@stylexjs/stylex";
import { useRouter } from "next/navigation";
import {
    ComponentProps,
    ReactElement,
    ReactNode,
    cloneElement,
    createContext,
    forwardRef,
    isValidElement,
    useEffect,
    useState,
} from "react";

import { Icon, IconProps } from "@/components/Icon";
import { Loader } from "@/components/Loader";
import { composeStyles } from "@/lib/utils/composeStyles";
import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { radii } from "@/styles/radii.stylex";
import { sizes } from "@/styles/sizes.stylex";
import { theme } from "@/styles/theme.stylex";

export interface ButtonProps extends Omit<ComponentProps<"button">, "style"> {
    asChild?: boolean;
    size: "sm" | "md";
    color: "primary" | "secondary" | "success" | "danger";
    loading?: boolean;
    icon?: IconProps["icon"];
    iconLabel?: string;
    link?: string;
    style?: StyleXStyles;
}

const ButtonContext = createContext<ButtonProps>(null!);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (baseProps, ref) => {
        "use client";

        const {
            asChild,
            className,
            style,
            size = "md",
            color,
            link,
            icon,
            iconLabel,
            loading: propsLoading,
            children: propsChildren,
            onClick,
            ...props
        } = baseProps as typeof baseProps & {
            children: ReactNode | ReactElement<any>;
        };

        const router = useRouter();

        const [loading, setLoading] = useState(false);

        const Component =
            asChild && typeof propsChildren !== "string" ? Slot : "button";
        const disabled = loading || props.disabled;

        useEffect(() => {
            setLoading(!!propsLoading);
        }, [propsLoading]);

        useEffect(() => {
            if (link) {
                router.prefetch(link);
            }
        }, [link, router]);

        const children = (
            <>
                {loading && (
                    <Loader
                        {...stylex.props(
                            disabled && styles.iconDisabled,

                            size === "sm" && styles.iconSm,
                            size === "md" && styles.iconMd,
                        )}
                    />
                )}

                {icon &&
                    !loading &&
                    (isValidElement(icon) || "render" in icon ? (
                        <Icon
                            {...stylex.props(
                                disabled && styles.iconDisabled,

                                size === "sm" && styles.iconSm,
                                size === "md" && styles.iconMd,
                            )}
                            label={iconLabel ?? "button"}
                            icon={icon}
                        />
                    ) : (
                        (icon as any)
                    ))}

                <span {...stylex.props(styles.childrenContainer)}>
                    {propsChildren &&
                    typeof propsChildren === "object" &&
                    "props" in propsChildren &&
                    "children" in propsChildren.props
                        ? propsChildren.props.children
                        : propsChildren}
                </span>
            </>
        );

        return (
            <ButtonContext.Provider value={baseProps}>
                <Component
                    ref={ref as any}
                    {...composeStyles(
                        stylex.props(
                            style,
                            // base states
                            styles.base,
                            disabled && styles.disabled,
                            // sizes
                            size === "sm" && styles.sizeSm,
                            size === "md" && styles.sizeMd,
                            // colours
                            color === "primary" && styles.primary,
                            color === "secondary" && styles.secondary,
                            color === "success" && styles.success,
                            color === "danger" && styles.danger,
                        ),
                        className,
                    )}
                    onClick={async (e) => {
                        setLoading(true);

                        try {
                            await onClick?.(e as any);
                        } catch (e) {
                            console.error(e);
                            setLoading(false);
                            return;
                        }

                        if (link) {
                            router.push(link);
                        } else {
                            setLoading(false);
                        }
                    }}
                    {...props}
                >
                    {asChild && typeof propsChildren !== "string"
                        ? cloneElement(propsChildren as any, {}, children)
                        : children}
                </Component>
            </ButtonContext.Provider>
        );
    },
);

const styles = stylex.create({
    // base states
    base: {
        transitionProperty: "opacity, color, background-color",
        transitionDelay: "150ms",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "fit-content",
        gap: sizes.spacing1,
        border: "none",
        cursor: "pointer",
    },
    disabled: {
        pointerEvents: "none",
        cursor: "not-allowed",
        opacity: 0.6,
    },

    // sizes
    sizeSm: {
        padding: `${sizes.spacing1} ${sizes.spacing2}`,
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        borderRadius: radii.lg,
    },
    sizeMd: {
        padding: `${sizes.spacing1_5} ${sizes.spacing3}`,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,
        borderRadius: radii.lg,
    },

    // colours
    primary: {
        backgroundColor: theme.primaryBackground,
        color: theme.primaryForeground,
    },
    secondary: {
        backgroundColor: theme.secondaryBackground,
        color: theme.secondaryForeground,
    },
    success: {
        backgroundColor: theme.successBackground,
        color: theme.successForeground,
    },
    danger: {
        backgroundColor: theme.dangerBackground,
        color: theme.dangerForeground,
    },

    // icon styles
    iconDisabled: {
        opacity: 0.6,
    },
    iconSm: {
        height: sizes.spacing4,
        width: sizes.spacing4,
    },
    iconMd: {
        height: sizes.spacing5,
        width: sizes.spacing5,
    },

    // util
    childrenContainer: {
        display: "flex",
        alignItems: "center",
        gap: sizes.spacing2,
    },
});
