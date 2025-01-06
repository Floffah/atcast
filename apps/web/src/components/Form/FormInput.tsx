"use client";

import { ComponentProps, useContext } from "react";

import {
    FormField,
    FormFieldBaseProps,
    useFormField,
} from "@/components/Form/FormField";
import { FormContext } from "@/components/Form/index";
import { Input } from "@/components/Input";

export type FormInputProps = Omit<
    ComponentProps<typeof Input> & FormFieldBaseProps,
    "children"
>;

export function FormInput({ ...props }: FormInputProps) {
    const { form } = useContext(FormContext);

    const {
        fieldProps,
        controlProps: { name, ...controlProps },
    } = useFormField(props);

    return (
        <FormField {...fieldProps}>
            <Input {...controlProps} {...form.register(name)} name={name} />
        </FormField>
    );
}
