"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import {
    ComponentProps,
    ComponentRef,
    forwardRef,
    useContext,
    useMemo,
    useRef,
} from "react";

import { Button } from "@/components/Button";
import { FormContext } from "@/components/Form/index";

export const FormButton = forwardRef<
    ComponentRef<typeof Button>,
    ComponentProps<typeof Button>
>(({ onClick, ...props }, externalRef) => {
    "use client";

    const { form, disabled: formDisabled, submit } = useContext(FormContext);

    const buttonRef = useRef<ComponentRef<typeof Button>>(null);

    const isInsideForm = useMemo(() => {
        const closestForm = buttonRef.current?.closest("form");

        return !!closestForm;
    }, [buttonRef]);

    return (
        <Button
            {...props}
            type="submit"
            loading={form.formState.isSubmitting || props.loading}
            disabled={formDisabled || props.disabled}
            ref={composeRefs(externalRef, buttonRef)}
            onClick={
                onClick ??
                (async (e) => {
                    if (
                        !isInsideForm &&
                        props.type !== "button" &&
                        props.type !== "reset"
                    ) {
                        await submit(e);
                    }
                })
            }
        />
    );
});
