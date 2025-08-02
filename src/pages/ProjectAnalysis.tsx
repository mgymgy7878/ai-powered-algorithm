import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Loader2, FileText, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProjectAnalysis() {
  const [markdown, setMarkdown] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const loadMarkdown = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/docs/ProjectAnalysis.md')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const text = await response.text()
      setMarkdown(text)
      setLastUpdated(new Date().toLocaleString('tr-TR'))
    } catch (err) {
      console.error('Markdown dosyası yüklenirken hata:', err)
      setError(err instanceof Error ? err.message : 'Dosya yüklenemedi')
      setMarkdown(`# ❌ Dosya Yüklenemedi\n\nProje analizi dosyası bulunamadı veya erişilemedi.\n\n**Hata:** ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMarkdown()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Proje analizi yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Proje Durumu & Analizi</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <Badge variant="outline" className="text-xs">
              Son Güncelleme: {lastUpdated}
            </Badge>
          )}
          <Button
            onClick={loadMarkdown}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Dosya Yükleme Hatası:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-200px)] p-6">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-4 text-foreground border-b pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium mt-6 mb-3 text-foreground">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-foreground leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 ml-6 space-y-2 text-foreground">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 ml-6 space-y-2 text-foreground">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground">{children}</li>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto">
                        {children}
                      </code>
                    )
                  },
                  pre: ({ children }) => (
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto mb-4">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full border-collapse border border-border">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border p-2 bg-muted font-semibold text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-border p-2">{children}</td>
                  ),
                  hr: () => <hr className="my-8 border-border" />
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}