"use client";

import * as RUIPopover from "@radix-ui/react-popover";
import clsx from "clsx";
import {
    ComponentProps,
    ComponentRef,
    ReactNode,
    createContext,
    forwardRef,
    isValidElement,
    useContext,
    useEffect,
    useState,
} from "react";

interface PopoverContextValue {
    open: boolean;
    close: () => void;
}

const PopoverContext = createContext<PopoverContextValue>(null!);

export const PopoverTrigger = forwardRef<
    ComponentRef<(typeof RUIPopover)["Trigger"]>,
    ComponentProps<(typeof RUIPopover)["Trigger"]>
>(({ children, ...props }, ref) => {
    return (
        <RUIPopover.Trigger ref={ref} {...props}>
            {children}
        </RUIPopover.Trigger>
    );
});

export const PopoverAnchor = forwardRef<
    ComponentRef<(typeof RUIPopover)["Anchor"]>,
    ComponentProps<(typeof RUIPopover)["Anchor"]>
>(({ children, ...props }, ref) => {
    return (
        <RUIPopover.Anchor {...props} ref={ref}>
            {children}
        </RUIPopover.Anchor>
    );
});

export const PopoverContent = forwardRef<
    ComponentRef<(typeof RUIPopover)["Content"]>,
    Omit<ComponentProps<(typeof RUIPopover)["Content"]>, "children"> & {
        children: ReactNode | ((ctx: PopoverContextValue) => ReactNode);
    }
>(({ className, children: propsChildren, ...props }, ref) => {
    const ctx = useContext(PopoverContext);

    let children: ReactNode = "invalid children";

    if (isValidElement(propsChildren)) {
        children = propsChildren as ReactNode;
    } else if (
        Array.isArray(propsChildren) &&
        !propsChildren.some((el) => !isValidElement(el))
    ) {
        children = propsChildren;
    } else if (typeof propsChildren === "function") {
        children = propsChildren(ctx);
    }

    return (
        <RUIPopover.Content
            {...props}
            ref={ref}
            className={clsx(
                className,
                "rounded-lg border border-gray-200 bg-gray-100 p-2 shadow-xl dark:border-white/10 dark:bg-gray-800",
            )}
        >
            <RUIPopover.Arrow className="fill-gray-100 dark:fill-gray-700" />

            {children}
        </RUIPopover.Content>
    );
});

export const Popover = Object.assign(
    ({
        children,
        open: propsOpen,
        defaultOpen,
        onOpenChange,
        ...props
    }: ComponentProps<(typeof RUIPopover)["Root"]>) => {
        const [open, setOpen] = useState(propsOpen ?? defaultOpen ?? false);

        useEffect(() => {
            if (typeof propsOpen === "boolean") {
                setOpen(propsOpen);
            }
        }, [propsOpen]);

        return (
            <RUIPopover.Root
                open={open}
                onOpenChange={(isOpen) => {
                    if (onOpenChange) {
                        onOpenChange?.(isOpen);
                    } else {
                        setOpen(isOpen);
                    }
                }}
                {...props}
            >
                <PopoverContext.Provider
                    value={{ open, close: () => setOpen(false) }}
                >
                    {children}
                </PopoverContext.Provider>
            </RUIPopover.Root>
        );
    },
    {
        Anchor: PopoverAnchor,
        Content: PopoverContent,
        Trigger: PopoverTrigger,
    },
);
