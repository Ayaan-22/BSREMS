import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <div className="rounded border border-error/40 bg-error/10 p-4 text-error">Something went wrong.</div>;
    return this.props.children;
  }
}
