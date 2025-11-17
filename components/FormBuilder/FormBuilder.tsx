"use client";

import React, {
    HTMLElementType,
    useCallback,
    useState,
    useTransition,
} from "react";

export type TField = {
    fieldKey: string;
    fieldLabel: string;
} & (
    | {
          fieldType: "input";
          fieldValue: string | number;
      }
    | {
          fieldType: "div" | "fieldset";
          fieldValue: TField[];
      }
);

export type TFormBuilder = {
    fields: TField[];
};

export type TFieldRenderer = {
    field: TField;
};

const isField = (obj: object): boolean => {
    const fieldObj: TField = {
        fieldKey: "",
        fieldLabel: "",
        fieldType: "input",
        fieldValue: "",
    };

    const fieldKeys = Object.keys(fieldObj);
    const objKeys = Object.keys(obj);

    if (fieldKeys.length != objKeys.length) return false;

    const fieldsCheck = fieldKeys.map((field) => {
        if (!objKeys.includes(field)) {
            return { field: false };
        }

        return { field: true };
    });
    return true;
};

export type TWrapFieldWithLabel = {
    WrapperElement: HTMLElementType;
    field: TField;
    fieldRenderer: React.ReactNode;
};

const WrapFieldWithLabel = React.memo(
    ({ WrapperElement, field, fieldRenderer }: TWrapFieldWithLabel) => {
        return (
            <WrapperElement className="flex flex-col border-[1] w-full">
                <div className="bg-gray-500 text-white font-bold">
                    {field.fieldLabel}
                </div>
                <div>{fieldRenderer}</div>
            </WrapperElement>
        );
    }
);

WrapFieldWithLabel.displayName = "WrapFieldWithLabel";

const FieldRenderer = ({ field }: TFieldRenderer) => {
    const [fieldState, setFieldState] = useState<TField>(field);
    const [isPending, startTransition] = useTransition();

    const handleChangeValue = useCallback(
        (field: TField, newValue: string | number) => {
            if (!isField(field)) return;

            startTransition(() => {
                setFieldState((prev) => {
                    if (prev.fieldType === "input") {
                        return {
                            ...prev,
                            fieldValue: newValue,
                        };
                    }
                    return prev;
                });
            });
        },
        []
    );

    switch (fieldState.fieldType) {
        case "fieldset":
        case "div":
            {
                const FieldTypeComponent = fieldState.fieldType;

                if (Array.isArray(fieldState.fieldValue)) {
                    return fieldState.fieldValue.map((subFieldState) => {
                        return (
                            <FieldTypeComponent
                                className="w-full"
                                key={subFieldState.fieldKey}
                            >
                                <div>{subFieldState.fieldLabel}</div>
                                <div className="p-1">
                                    <FieldRenderer
                                        field={subFieldState.fieldValue}
                                    />
                                </div>
                            </FieldTypeComponent>
                        );
                    });
                }
            }
            break;

        case "input":
            {
                const FieldTypeComponent = fieldState.fieldType;

                return (
                    <WrapFieldWithLabel
                        field={fieldState}
                        WrapperElement={"div"}
                        fieldRenderer={
                            <FieldTypeComponent
                                className="w-full"
                                value={fieldState.fieldValue}
                                onChange={(event) =>
                                    handleChangeValue(
                                        fieldState,
                                        event.currentTarget.value
                                    )
                                }
                            />
                        }
                    />
                );
            }
            break;
    }
};

const FormBuilder = ({ fields }: TFormBuilder) => {
    const FieldRendererMemo = React.memo(FieldRenderer);

    return (
        <form className="flex flex-col gap-2">
            {fields.map((field) => {
                return (
                    <div key={field.fieldKey} className="flex flex-row">
                        <FieldRendererMemo field={field} />
                    </div>
                );
            })}
        </form>
    );
};

export default FormBuilder;
