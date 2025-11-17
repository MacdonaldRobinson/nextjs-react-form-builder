import React from "react";
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
    onFieldUpdated: (field: TField) => void;
    onFieldIntialized: (field: TField) => void;
};

const FieldRenderer = React.memo(
    ({ field, onFieldUpdated, onFieldIntialized }: TFieldRenderer) => {
        const [state, setState] = useState<TField>(field);
        const [isPending, startTransition] = useTransition();

        if (state.isContainer) {
            return state.fieldValue.map((subField) => {
                return (
                    <fieldset
                        key={subField.fieldKey}
                        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
                    >
                        <legend className="fieldset-legend">
                            {state.fieldLabel}
                        </legend>
                        <FieldRenderer
                            onFieldIntialized={onFieldIntialized}
                            onFieldUpdated={onFieldUpdated}
                            key={subField.fieldKey}
                            field={subField}
                        />
                    </fieldset>
                );
            });
        } else {
            const FieldTypeComponent = state.fieldType;

            const handleChange = (field: TField, newValue: string | number) => {
                if (field.isContainer) return;

                startTransition(() => {
                    setState((prev) => {
                        if (prev.isContainer) return prev;

                        return {
                            ...prev,
                            fieldValue: newValue,
                        };
                    });

                    onFieldUpdated(field);
                });
            };

            return (
                <div className="field">
                    <label className="label">{field.fieldLabel}</label>
                    <FieldTypeComponent
                        className="input"
                        placeholder={state.fieldLabel}
                        value={state.fieldValue}
                        onChange={(event) =>
                            handleChange(state, event.currentTarget.value)
                        }
                    />
                </div>
            );
        }
    }
);

FieldRenderer.displayName = "FieldRenderer";

const FormBuilder = ({ fields }: TFormBuilder) => {
    const [state, setState] = useState<TField[]>();

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = useCallback(() => {
        setIsSubmitted(true);
    }, []);

    const handleFieldUpdated = useCallback((field: TField) => {
        console.log("updateD!", field);
    }, []);

    const handleFieldIntialized = useCallback((field: TField) => {
        console.log("updateD!", field);
    }, []);

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
