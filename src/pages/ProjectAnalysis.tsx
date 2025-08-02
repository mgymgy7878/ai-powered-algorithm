import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { FileText, Loader2, AlertCircle } from 'lucide-react'

export default function ProjectAnalysis() {
  const [markdown, setMarkdown] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProjectAnalysis = async () => {
      try {
        setLoading(true)
        const response = await fetch('/docs/ProjectAnalysis.md')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const content = await response.text()
        setMarkdown(content)
        setError(null)
      } catch (err) {
        console.error('Proje analizi yüklenirken hata:', err)
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
        setMarkdown(`# ⚠️ Dosya Yüklenemedi\n\nProje analizi dosyası yüklenirken bir hata oluştu.\n\n**Hata:** ${err instanceof Error ? err.message : 'Bilinmeyen hata'}\n\nLütfen \`/public/docs/ProjectAnalysis.md\` dosyasının mevcut olduğundan emin olun.`)
      } finally {
        setLoading(false)
      }
    }

    loadProjectAnalysis()
  }, [])

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Proje analizi yükleniyor...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Proje Durumu & Analizi</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            v0.3.0
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Aktif Geliştirme
          </Badge>
          {error && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Yükleme Hatası
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-2">
          AI Trading Platform'unun mevcut durumu, özellikleri ve gelecek planları
        </p>
      </div>

      {/* Content */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detaylı Analiz Raporu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  // Başlıkları özelleştir
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold border-b pb-2 mb-4 text-primary">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold mt-8 mb-4 text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium mt-6 mb-3 text-foreground">
                      {children}
                    </h3>
                  ),
                  // Kod blokları
                  code: ({ children, className }) => (
                    <code className={`${className} bg-muted px-1 py-0.5 rounded text-sm font-mono`}>
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                      {children}
                    </pre>
                  ),
                  // Liste öğeleri
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 space-y-2 my-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 space-y-2 my-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground">
                      {children}
                    </li>
                  ),
                  // Blok quote
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                      {children}
                    </blockquote>
                  ),
                  // Tablo
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border border-border">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border px-4 py-2 bg-muted text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-border px-4 py-2">
                      {children}
                    </td>
                  ),
                  // Paragraf
                  p: ({ children }) => (
                    <p className="text-foreground leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  // Bağlantılar
                  a: ({ children, href }) => (
                    <a 
                      href={href} 
                      className="text-primary hover:text-primary/80 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
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