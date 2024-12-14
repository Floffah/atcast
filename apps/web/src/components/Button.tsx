"use client";

import { Slot } from "@radix-ui/react-slot";
import { ReactNodeView } from "@tiptap/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import {
    ComponentProps,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    cloneElement,
    createContext,
    forwardRef,
    useEffect,
    useState,
} from "react";

import { Icon, IconProps } from "@/components/Icon";
import { Loader } from "@/components/Loader";

export interface ButtonProps extends ComponentProps<"button"> {
    asChild?: boolean;
    size: "sm" | "md";
    color: "primary" | "secondary" | "success" | "danger";
    loading?: boolean;
    icon?: IconProps["icon"];
    iconLabel?: string;
    link?: string;
}

const ButtonContext = createContext<ButtonProps>(null!);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (baseProps, ref) => {
        "use client";

        const {
            asChild,
            className,
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
                        className={clsx({
                            "opacity-60": disabled,

                            "h-4 w-4": size === "sm",
                            "h-5 w-5": size === "md",
                        })}
                    />
                )}

                {icon &&
                    !loading &&
                    (typeof icon === "function" ? (
                        <Icon
                            className={clsx({
                                "opacity-60": disabled,

                                "h-4 w-4": size === "sm",
                                "h-5 w-5": size === "md",
                            })}
                            label={iconLabel ?? "button"}
                            icon={icon}
                        />
                    ) : (
                        icon
                    ))}

                <span className="flex items-center gap-2">
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
                    className={clsx(
                        className,
                        "transition-[opacity,color,background-color] duration-150",
                        {
                            "flex h-fit items-center justify-center space-x-1":
                                !asChild,

                            "pointer-events-none cursor-not-allowed opacity-60":
                                disabled,

                            "rounded-lg px-2 py-1 text-sm": size === "sm",
                            "rounded-lg px-3 py-1.5": size === "md",

                            "bg-blue-500 text-white dark:bg-blue-700":
                                color === "primary",
                            "bg-green-500 text-white dark:bg-green-700":
                                color === "success",
                            "border border-black/10 bg-black/5 text-black dark:border-white/10 dark:bg-white/5 dark:text-white":
                                color === "secondary",
                            "bg-red-500 text-white dark:bg-red-800":
                                color === "danger",
                        },
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
