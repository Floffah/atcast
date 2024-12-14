"use client";

import { ComponentProps, useContext } from "react";

import {
    FormField,
    FormFieldBaseProps,
    useFormField,
} from "@/components/Form/FormField";
import { FormContext } from "@/components/Form/index";
import { TextArea } from "@/components/TextArea";

export interface FormTextAreaProps
    extends Omit<
        ComponentProps<typeof TextArea> & FormFieldBaseProps,
        "children"
    > {}

export function FormTextArea({ ...props }: FormTextAreaProps) {
    const { form } = useContext(FormContext);

    const {
        fieldProps,
        controlProps: { name, ...controlProps },
    } = useFormField(props);

    return (
        <FormField {...fieldProps}>
            <TextArea {...controlProps} {...form.register(name)} name={name} />
        </FormField>
    );
}
