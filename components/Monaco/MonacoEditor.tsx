import { Editor, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import beautify from "js-beautify";

export type TMomacoEditor = {
    code: object;
    onSubmitNewCode: (newCode: object) => void;
    onSubmitResetCode: () => void;
};

const MomacoEditor = ({
    code,
    onSubmitNewCode,
    onSubmitResetCode,
}: TMomacoEditor) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

    const [editorCode, setEditorCode] = useState<string>();
    const [hasChanged, setHasChanged] = useState<boolean>(false);

    const onEditorMounted = (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco
    ) => {
        editorRef.current = editor; // Save editor instance

        window.addEventListener("reset", () => {
            editor.layout();
        });
    };

    const updateEditorCode = (newCode: object) => {
        console.log("updateEditorCode", editorRef);
        if (!editorRef || !editorRef.current) return;

        const codeStr = JSON.stringify(newCode);
        const formatedCode = beautify.js(codeStr);

        editorRef.current.setValue(formatedCode);
    };

    const handleOnChange = (
        value: string | undefined,
        ev: editor.IModelContentChangedEvent
    ) => {
        setHasChanged(true);
    };

    const handleReset = () => {
        if (!editorRef) return;

        onSubmitResetCode();
    };

    const handleSubmit = () => {
        if (!editorRef) return;

        const codeStr: string = editorRef.current?.getValue() ?? "";
        const newCode = JSON.parse(codeStr);

        onSubmitNewCode(newCode);
    };

    useEffect(() => {
        if (editorRef.current) {
            updateEditorCode(code);
        }
    }, [code, editorRef]);

    return (
        <fieldset className="flex flex-col h-full w-full">
            <div className="h-full w-full">
                <Editor
                    onMount={onEditorMounted}
                    onChange={handleOnChange}
                    height="100%"
                    width={"100%"}
                    defaultLanguage="json" // Can be 'json', 'javascript', 'typescript', etc.
                    defaultValue={editorCode}
                    theme="vs-dark"
                />
            </div>
            <div>
                {hasChanged && (
                    <>
                        <button
                            className="btn btn-neutral mt-4"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button
                            className="btn btn-neutral mt-4"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </>
                )}
            </div>
        </fieldset>
    );
};

export default MomacoEditor;
