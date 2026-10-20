import { Component, type ErrorInfo, type ReactNode } from "react";
import { clearAuthSession } from "../utils/utils";

// If any component throws while rendering, React unmounts the whole app and
// the page goes white. An error boundary catches that and shows this message
// instead, with a way to recover. It has to be a class component: React only
// supports error boundaries through componentDidCatch / getDerivedStateFromError.
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("NetPass crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{ padding: "48px 24px", maxWidth: 560, margin: "0 auto", fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: 22 }}>Something went wrong.</h1>
        <p>NetPass hit an unexpected error. Your saved credentials are not affected.</p>
        <pre style={{ whiteSpace: "pre-wrap", background: "#f4f4f5", padding: 12, borderRadius: 8, fontSize: 13 }}>
          {this.state.error.message}
        </pre>
        <button
          type="button"
          style={{ marginTop: 12, padding: "10px 16px", cursor: "pointer" }}
          onClick={() => {
            clearAuthSession();
            window.location.reload();
          }}
        >
          Sign out and reload
        </button>
      </div>
    );
  }
}
