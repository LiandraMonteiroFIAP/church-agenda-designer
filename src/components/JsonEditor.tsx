import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, AlertCircle, CheckCircle2 } from "lucide-react";

interface JsonEditorProps {
  jsonText: string;
  onJsonChange: (text: string) => void;
  isValid: boolean;
  error: string | null;
  onExport: () => void;
  exporting: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  jsonText,
  onJsonChange,
  isValid,
  error,
  onExport,
  exporting,
}) => {
  useEffect(() => {

    if (isValid) {
      try {
        const parsed = JSON.parse(jsonText);
        localStorage.setItem("agendaData", JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    }
  }, [jsonText]);

  return (
    <div className="json-editor-container flex flex-col h-[75vh] sm:h-[70vh] gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-[Quicksand] text-foreground">Editor JSON</h2>
        <div className="flex items-center gap-2">
          {isValid ? (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" /> Válido
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" /> Inválido
            </span>
          )}
        </div>
      </div>

      <textarea
        value={jsonText}
        onChange={(e) => onJsonChange(e.target.value)}
        spellCheck={false}
        className="flex-1 w-full rounded-lg border border-input bg-card text-foreground px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        style={{ minHeight: 400 }}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={onExport}
        disabled={!isValid || exporting}
        className="w-full gap-2"
        size="lg"
      >
        <Download className="w-5 h-5" />
        {exporting ? "Exportando..." : "Exportar PNG"}
      </Button>
    </div>
  );
};

export default JsonEditor;
