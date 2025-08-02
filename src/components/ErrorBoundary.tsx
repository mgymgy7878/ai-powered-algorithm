import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Log the specific error details
    if (error.message?.includes('toLocaleString')) {
      console.error('toLocaleString error detected:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    }
    
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
          <div className="max-w-md w-full">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-destructive mb-2">
                Uygulama Hatası
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
              </p>
              
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Hata Detayları
                </summary>
                <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                  <p><strong>Hata:</strong> {this.state.error?.message}</p>
                  {this.state.error?.stack && (
                    <pre className="mt-2 text-xs overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}