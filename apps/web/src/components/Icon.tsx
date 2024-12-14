"use client";

import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { SVGProps, createElement, forwardRef } from "react";

import type UnpluginIcon from "~icons/*";

export interface IconProps extends SVGProps<SVGSVGElement> {
    label?: string;
    icon: typeof UnpluginIcon;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ label, icon, ...props }, ref) => {
        const iconEl = createElement(icon, {
            ref: ref as any,
            "aria-hidden": true,
            ...props,
        });

        if (!label) {
            return iconEl;
        }

        return (
            <AccessibleIcon.Root label={label}>{iconEl}</AccessibleIcon.Root>
        );
    },
);
