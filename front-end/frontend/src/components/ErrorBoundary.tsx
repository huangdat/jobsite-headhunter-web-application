import React from "react";
import { ErrorMessage } from "./ErrorMessage";
import { getSemanticClass } from "@/lib/design-tokens";

type Props = { children: React.ReactNode };

export default class ErrorBoundary extends React.Component<
  Props,
  { hasError: boolean }
> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // log to console for now
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={`p-4 rounded ${getSemanticClass("danger", "bg", true)} ${getSemanticClass("danger", "text", true)}`}
        >
          <ErrorMessage />
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
