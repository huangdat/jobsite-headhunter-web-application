import React from "react";

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
    // eslint-disable-next-line custom/no-hardcoded-strings
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded bg-red-50 text-red-700">
          {
            // eslint-disable-next-line custom/no-hardcoded-strings
            "Editor failed to load."
          }
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
