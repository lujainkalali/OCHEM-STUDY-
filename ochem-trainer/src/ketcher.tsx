import { useRef } from "react";
import { Editor } from "ketcher-react";
import { StandaloneStructServiceProvider } from "ketcher-standalone";
import type { Ketcher } from "ketcher-core";
import "ketcher-react/dist/index.css";

const structServiceProvider = new StandaloneStructServiceProvider();

// Define props type
interface KetcherEditorProps {
  onInit?: (ketcher: Ketcher) => void;
}

export default function KetcherEditor({ onInit }: KetcherEditorProps) {
  const ketcherRef = useRef<Ketcher | null>(null);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Editor
        staticResourcesUrl="/"
        structServiceProvider={structServiceProvider}
        errorHandler={(message) => {
          console.error("Ketcher error:", message);
        }}
        onInit={(ketcher) => {
          ketcherRef.current = ketcher;
          if (onInit) {
            onInit(ketcher); // Pass the ketcher instance up to App
          }
        }}
      />
    </div>
  );
}