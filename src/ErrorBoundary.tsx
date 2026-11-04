import { Link } from "@tanstack/react-router";
import { Component, type ErrorInfo, type ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error Boundary menangkap error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] text-center">
          <h2>Waduh!</h2>
          <p>
            Telah terjadi Error pada list ini{" "}
            <Link className="text-primary underline hover:opacity-80" to={"/"}>
              Click disini
            </Link>{" "}
            untuk kembali ke beranda
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
