import clsx from "clsx";
import { forwardRef } from "react";

import LoadingIcon from "~icons/mdi/loading";

import { Icon, IconProps } from "@/components/Icon";

export const Loader = forwardRef<
    SVGSVGElement,
    Omit<IconProps, "ref" | "label" | "icon">
>(({ className, ...props }, ref) => {
    return (
        <Icon
            label="loading"
            icon={LoadingIcon}
            ref={ref}
            className={clsx("animate-spin", className)}
            {...props}
        />
    );
});
