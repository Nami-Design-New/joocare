"use client";

import React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  getHttpErrorMessage,
  getHttpStatusCode,
  getHttpStatusMeta,
} from "@/shared/lib/http-error";

type FallbackRenderProps = {
  error: Error;
  reset: () => void;
};

type ClientErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  fallbackRender?: (props: FallbackRenderProps) => React.ReactNode;
};

type ClientErrorBoundaryState = {
  error: Error | null;
};

export default class ClientErrorBoundary extends React.Component<
  ClientErrorBoundaryProps,
  ClientErrorBoundaryState
> {
  state: ClientErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): ClientErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ClientErrorBoundary caught an error", error, errorInfo);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    if (this.props.fallbackRender) {
      return this.props.fallbackRender({
        error,
        reset: this.reset,
      });
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const statusCode = getHttpStatusCode(error) ?? 500;
    const meta = getHttpStatusMeta(statusCode, getHttpErrorMessage(error));

    return (
      <section className="bg-card rounded-3xl border p-6 text-center shadow-sm">
        <p className="text-primary text-sm font-semibold">{statusCode}</p>
        <h2 className="text-foreground mt-3 text-xl font-semibold">
          {meta.title}
        </h2>
        <p className="text-muted-foreground mt-3 text-sm">
          {meta.description}
        </p>
        <div className="mt-6 flex justify-center">
          <Button size="pill" onClick={this.reset}>
            Try again
          </Button>
        </div>
      </section>
    );
  }
}
