import React, { RefObject, useEffect, useRef } from "react";
import { JSX, useCallback, useState, useTransition } from "react";

export type TField = {
    fieldKey: string;
    fieldLabel: string;
} & (
    | {
          isContainer: true;
          fieldType: "div" | "fieldset";
          fieldValue: TField[];
      }
    | {
          isContainer: false;
          fieldType: "input";
          fieldValue: string | number;
      }
);

export type TFormBuilder = {
    fields: TField[];
};

export type TFieldRenderer = {
    field: TField;
    onFieldUpdated: (field: TField, newValue: string | number) => void;
    onFieldIntialized: (
        field: TField,
        refObject: RefObject<HTMLElement | null>
    ) => void;
};

const FieldRenderer = ({
    field,
    onFieldUpdated,
    onFieldIntialized,
}: TFieldRenderer) => {
    const elementRef = useRef(null);
    useEffect(() => {
        onFieldIntialized(field, elementRef);
    }, [elementRef]);
    if (field.isContainer) {
        return (
            <fieldset
                key={field.fieldKey}
                className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
            >
                <legend className="fieldset-legend">{field.fieldLabel}</legend>
                {field.fieldValue.map((subField) => {
                    return (
                        <FieldRenderer
                            onFieldIntialized={onFieldIntialized}
                            onFieldUpdated={onFieldUpdated}
                            key={subField.fieldKey}
                            field={subField}
                        />
                    );
                })}
            </fieldset>
        );
    } else {
        const FieldTypeComponent = field.fieldType;

        const handleChange = (field: TField, newValue: string | number) => {
            onFieldUpdated(field, newValue);
        };

        return (
            <div className="field">
                <label className="label">{field.fieldLabel}</label>
                <FieldTypeComponent
                    ref={elementRef}
                    className="input"
                    placeholder={field.fieldLabel}
                    value={field.fieldValue}
                    onChange={(event) =>
                        handleChange(field, event.currentTarget.value)
                    }
                />
            </div>
        );
    }
};

const FormBuilder = ({ fields }: TFormBuilder) => {
    const [state, setState] = useState<TField[]>([]);

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = useCallback(() => {
        setIsSubmitted(true);
    }, []);

    const handleFieldUpdated = useCallback((field: TField) => {
        //console.log("ram", field);
        // const findField = (parent: TField[], field: TField): TField[] => {
        //     if (field.fieldKey == field.fieldKey) {
        //         return field;
        //     }
        //     if (field.isContainer) {
        //         field.fieldValue.forEach((f) => {
        //             return findField(f);
        //         });
        //     }
        //     return null;
        // };
        // console.log(findField(field));
    }, []);

    const handleFieldIntialized = useCallback((field: TField) => {
        console.log("fieldInitialled", field);
    }, []);

    useEffect(() => {
        setState(fields);
    }, [fields]);

    return (
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Form</legend>
            {fields.map((field) => {
                return (
                    <FieldRenderer
                        key={field.fieldKey}
                        field={field}
                        onFieldIntialized={handleFieldIntialized}
                        onFieldUpdated={handleFieldUpdated}
                    />
                );
            })}
            <button className="btn btn-neutral mt-4" onClick={handleSubmit}>
                Submit
            </button>
            {isSubmitted && <div>Submitted!</div>}
        </fieldset>
    );
};

export default FormBuilder;
