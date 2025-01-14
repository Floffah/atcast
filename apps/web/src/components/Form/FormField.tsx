"use client";

import stylex, { StyleXStyles } from "@stylexjs/stylex";
import {
    ComponentProps,
    PropsWithChildren,
    ReactNode,
    useContext,
    useMemo,
} from "react";

import { FormContext } from "@/components/Form/index";
import { composeStyles } from "@/lib/utils/composeStyles";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { sizes } from "@/styles/sizes.stylex";

export interface FormFieldBaseProps {
    name: string;
    label?: ReactNode;
    description?: ReactNode;
    warning?: ReactNode;
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
    position?: "start" | "end";
    style?: StyleXStyles;
}

export const useFormField = <Props extends FormFieldBaseProps>(
    props: Props,
    opts: {
        defaultOrientation?: FormFieldBaseProps["orientation"];
        defaultPosition?: FormFieldBaseProps["position"];
    } = {},
) => {
    "use client";

    const { form, disabled: formDisabled } = useContext(FormContext);

    const {
        name,
        label,
        description,
        warning,
        orientation = opts.defaultOrientation,
        position = opts.defaultPosition,
        disabled: propsDisabled,
        ...rest
    } = props;

    const disabled =
        formDisabled || form?.formState?.isSubmitting || propsDisabled;

    const error = form.formState.errors[name];

    return {
        error,
        fieldProps: {
            name,
            label,
            description,
            warning,
            orientation,
            position,
            disabled,
        },
        controlProps: {
            ...rest,
            name,
            disabled,
            error,
        },
    };
};

export type FormFieldProps = Omit<
    Omit<ComponentProps<"div">, "style"> & FormFieldBaseProps,
    "ref" | "children"
>;

export function FormField({
    label,
    name,
    description,
    warning,
    orientation = "vertical",
    position = "start",
    style: _, // TODO: add back when no longer causes a build error
    className,
    children,
    ...props
}: PropsWithChildren<FormFieldProps>) {
    const { form } = useContext(FormContext);

    const error = form.formState.errors[name];
    const errorMessage = useMemo(() => {
        if (!error) {
            return null;
        }

        if (error.message) {
            return error.message as string;
        } else {
            return error.type as string;
        }
    }, [error]);

    const renderLabel = () => {
        return (
            label && (
                <label
                    {...stylex.props(
                        styles.label,
                        !!errorMessage && styles.labelError,
                    )}
                >
                    {label}
                </label>
            )
        );
    };

    const renderDescription = () => {
        return (
            description && (
                <p
                    {...stylex.props(
                        styles.description,
                        !!errorMessage && styles.descriptionError,
                    )}
                >
                    {description}
                </p>
            )
        );
    };

    const renderWarning = () => {
        return (
            warning &&
            !errorMessage && <p {...stylex.props(styles.warning)}>{warning}</p>
        );
    };

    const renderErrorMessage = () => {
        return (
            errorMessage && (
                <p {...stylex.props(styles.error)}>{errorMessage}</p>
            )
        );
    };

    return (
        <div
            {...composeStyles(stylex.props(styles.container), className)}
            {...props}
        >
            {orientation === "vertical" && (
                <>
                    {renderLabel()}
                    {renderDescription()}

                    {children}

                    {renderWarning()}
                    {renderErrorMessage()}
                </>
            )}

            {orientation === "horizontal" && (
                <div {...stylex.props(styles.horizontalContainer)}>
                    <div
                        {...stylex.props(
                            styles.horizontalFieldWrapper,
                            position === "end" &&
                                styles.horizontalFieldWrapperEndPosition,
                        )}
                    >
                        {children}

                        <div
                            data-position={position}
                            {...stylex.props(
                                styles.horizontalInfoContainer,
                                position === "end" &&
                                    styles.horizontalInfoContainerEndPosition,
                            )}
                        >
                            {renderLabel()}
                            {renderDescription()}
                        </div>
                    </div>

                    {renderWarning()}
                    {renderErrorMessage()}
                </div>
            )}
        </div>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";
const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing1,
    },

    horizontalContainer: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing1,
    },

    horizontalFieldWrapper: {
        display: "flex",
        alignItems: "center",
        gap: sizes.spacing2,
    },

    horizontalFieldWrapperEndPosition: {
        flexDirection: "row-reverse",
    },

    horizontalInfoContainer: {
        display: "flex",
        flexDirection: "column",
    },

    horizontalInfoContainerEndPosition: {
        flex: "1 1 auto",
    },

    label: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        color: {
            default: colours.gray700,
            [DARK]: "rgb(from white r g b / 80%)",
        },
    },

    labelError: {
        color: colours.red500,
    },

    description: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        fontWeight: fontWeights.light,
        color: {
            default: colours.gray500,
            [DARK]: "rgb(from white r g b / 70%)",
        },
    },

    descriptionError: {
        color: {
            default: colours.red500,
            [DARK]: `rgb(from ${colours.red500} r g b / 30%)`,
        },
    },

    warning: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        color: colours.yellow500,
    },

    error: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        color: colours.red500,
    },
});
