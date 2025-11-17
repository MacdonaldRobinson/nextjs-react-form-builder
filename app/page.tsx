"use client";
import FormBuilder, { TField } from "@/components/FormBuilder/FormBuilder";
import { useMemo } from "react";

export default function Home() {
    const fields: TField[] = useMemo(
        () => [
            {
                fieldKey: "name",
                fieldLabel: "Name",
                fieldType: "input",
                fieldValue: "mac",
                isContainer: false,
            },
            {
                fieldKey: "age",
                fieldLabel: "Age",
                fieldType: "input",
                fieldValue: 1,
                isContainer: false,
            },
            {
                fieldKey: "address",
                fieldLabel: "Address",
                fieldType: "fieldset",
                isContainer: true,
                fieldValue: [
                    {
                        fieldKey: "city",
                        fieldLabel: "City",
                        fieldType: "input",
                        fieldValue: "calgary",
                        isContainer: false,
                    },
                ],
            },
        ],
        []
    );

    return (
        <div>
            <FormBuilder fields={fields} />
        </div>
    );
}
