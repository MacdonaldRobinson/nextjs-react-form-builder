"use client";
import FormBuilder, { TField } from "@/components/FormBuilder/FormBuilder";
import MonacoEditor from "@/components/Monaco/MonacoEditor";
import { useMemo, useState } from "react";

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
                    {
                        fieldKey: "country",
                        fieldLabel: "Country",
                        fieldType: "input",
                        fieldValue: "canada",
                        isContainer: false,
                    },
                ],
            },
        ],
        []
    );

    const [stateFields, setStateFields] = useState<TField[]>(fields);

    const onSubmitNewCode = (newCode: object) => {
        setStateFields(newCode as TField[]);
    };

    const onSubmitResetCode = () => {
        console.log("ran reset");
    };

    return (
        <div className="w-full h-full">
            <h1 className="text-2xl font-bold m-2">
                React Form Builder from JSON
            </h1>
            <div className="flex flex-row space-between gap-2 w-full h-full">
                <div className="w-full">
                    <MonacoEditor
                        onSubmitNewCode={onSubmitNewCode}
                        onSubmitResetCode={onSubmitResetCode}
                        code={stateFields}
                    />
                </div>
                <div>
                    <FormBuilder fields={stateFields} />
                </div>
            </div>
        </div>
    );
}
