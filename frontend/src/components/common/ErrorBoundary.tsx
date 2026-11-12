import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-ink-900 p-6 text-center">
          <div className="max-w-md rounded-3xl border border-error/30 bg-error/[.06] p-10">
            <p className="font-display text-4xl text-white">Something went wrong.</p>
            <p className="mt-3 text-sm text-slate-400">The interface hit an unexpected error. Reload to try again.</p>
            <button onClick={() => window.location.reload()} className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-950">
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
