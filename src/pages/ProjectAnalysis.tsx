import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Loader2, FileText, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ProjectAnalysis() {
  const [markdown, setMarkdown] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/docs/ProjectAnalysis.md')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const text = await response.text()
        setMarkdown(text)
      } catch (err) {
        console.error('ProjectAnalysis.md yükleme hatası:', err)
        setError(err instanceof Error ? err.message : 'Dosya yüklenemedi')
      } finally {
        setLoading(false)
      }
    }

    fetchMarkdown()
  }, [])

  if (loading) {
    return (
      <div className="p-6 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Proje analizi yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Hata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                Proje analizi dosyası yüklenemedi: {error}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-screen">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">📊 Proje Özeti</h1>
                <p className="text-muted-foreground">
                  AI Trading Platform geliştirme durumu ve teknik analiz
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">v0.3.0</Badge>
              <Badge variant="secondary">Aktif Geliştirme</Badge>
              <Badge variant="outline">React + TypeScript</Badge>
              <Badge variant="outline">AI Entegreli</Badge>
            </div>
          </div>

          {/* Markdown Content */}
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    // Custom heading renderer for better styling
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b border-border">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 pb-1 border-b border-border">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    // Custom code block styling
                    code: ({ inline, children, ...props }) => {
                      if (inline) {
                        return (
                          <code 
                            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                            {...props}
                          >
                            {children}
                          </code>
                        )
                      }
                      return (
                        <code 
                          className="block bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto"
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                    // Custom list styling
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 space-y-1 text-foreground">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li className="text-foreground leading-relaxed">
                        {children}
                      </li>
                    ),
                    // Custom paragraph styling
                    p: ({ children }) => (
                      <p className="text-foreground leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                    // Custom blockquote styling
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary bg-muted/50 p-4 italic my-4">
                        {children}
                      </blockquote>
                    ),
                    // Custom table styling
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border border-border rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-border px-4 py-2">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')} • 
              Spark AI Trading Platform
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}