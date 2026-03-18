'use client';

import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <span className="text-5xl mb-4">🤔</span>
          <h3 className="font-display font-bold text-lg text-cream mb-2">
            Something went wrong
          </h3>
          <p className="text-text-2 text-sm mb-6 max-w-xs">
            An unexpected error occurred. Try refreshing or click retry below.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-5 py-2.5 rounded-full bg-linear-to-r from-fire to-ember text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            🔄 Retry
          </button>
          {this.state.error && (
            <button
              onClick={() =>
                this.setState((s) => ({ showDetails: !s.showDetails }))
              }
              className="mt-3 text-muted-custom text-xs hover:text-cream transition-colors"
            >
              {this.state.showDetails ? 'Hide details' : 'Show details'}
            </button>
          )}
          {this.state.showDetails && this.state.error && (
            <pre className="mt-3 p-3 rounded-lg bg-bg-surface border border-border text-xs text-text-2 max-w-md overflow-auto text-left">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
