"use client";

import {
    BaseSyntheticEvent,
    ComponentProps,
    PropsWithChildren,
    createContext,
    forwardRef,
    useCallback,
    useContext,
} from "react";
import {
    FormProvider as RHFProvider,
    SubmitErrorHandler,
    SubmitHandler,
    UseFormReturn,
} from "react-hook-form";

import { FormButton } from "@/components/Form/FormButton";
import { FormInput } from "@/components/Form/FormInput";
import { FormTextArea } from "@/components/Form/FormTextArea";

export interface FormProps {
    form: UseFormReturn<any, any, any>;
    disabled?: boolean;
    submitHandler: SubmitHandler<any>;
    submitErrorHandler?: SubmitErrorHandler<any>;
}

export interface FormContextValue extends FormProps {
    submit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export const FormContext = createContext<FormContextValue>(null!);

export const FormProvider = ({
    children,
    ...value
}: PropsWithChildren<FormProps>) => {
    "use client";

    const submit = useCallback(
        (e?: BaseSyntheticEvent) =>
            value.form.handleSubmit(
                value.submitHandler,
                value.submitErrorHandler,
            )(e),
        [value.form, value.submitErrorHandler, value.submitHandler],
    );

    return (
        <FormContext.Provider
            value={{
                ...value,
                submit,
            }}
        >
            <RHFProvider {...value.form}>{children}</RHFProvider>
        </FormContext.Provider>
    );
};

export const FormRoot = forwardRef<HTMLFormElement, ComponentProps<"form">>(
    ({ children, ...props }, ref) => {
        "use client";

        const form = useContext(FormContext);

        return (
            <form {...props} ref={ref} onSubmit={form.submit}>
                {children}
            </form>
        );
    },
);

export const Form = Object.assign(
    forwardRef<
        HTMLFormElement,
        Omit<ComponentProps<"form">, "onSubmit" | "ref"> & FormProps
    >(
        (
            { form, submitHandler, submitErrorHandler, children, ...props },
            ref,
        ) => {
            "use client";

            return (
                <FormProvider
                    form={form}
                    disabled={props.disabled}
                    submitHandler={submitHandler}
                    submitErrorHandler={submitErrorHandler}
                >
                    <FormRoot ref={ref} {...props}>
                        {children}
                    </FormRoot>
                </FormProvider>
            );
        },
    ),
    {
        Provider: FormProvider,
        Root: FormRoot,
        Button: FormButton,
        Input: FormInput,
        TextArea: FormTextArea,
    },
);
