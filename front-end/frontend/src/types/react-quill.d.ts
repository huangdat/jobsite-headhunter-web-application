declare module "react-quill" {
  import * as React from "react";
  interface ReactQuillProps {
    value?: any;
    onChange?: (content: any, delta?: any, source?: any, editor?: any) => void;
    [key: string]: any;
  }
  const ReactQuill: React.ComponentType<ReactQuillProps>;
  export default ReactQuill;
}
