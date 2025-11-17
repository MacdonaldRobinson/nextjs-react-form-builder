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
            },
            {
                fieldKey: "age",
                fieldLabel: "Age",
                fieldType: "input",
                fieldValue: 1,
            },
            {
                fieldKey: "address",
                fieldLabel: "Address",
                fieldType: "fieldset",
                fieldValue: [
                    {
                        fieldKey: "city",
                        fieldLabel: "City",
                        fieldType: "input",
                        fieldValue: "calgary",
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
