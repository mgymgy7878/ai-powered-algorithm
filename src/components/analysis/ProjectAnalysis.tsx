import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { RefreshCw, FileText, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function ProjectAnalysis() {
  const [markdown, setMarkdown] = useState<string>('📄 Proje analizi yükleniyor...')
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const loadMarkdown = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/docs/ProjectAnalysis.md')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const text = await response.text()
      setMarkdown(text)
      setLastUpdated(new Date().toLocaleString('tr-TR'))
      toast.success('Proje analizi başarıyla yüklendi!')
    } catch (error) {
      console.error('Markdown yükleme hatası:', error)
      setMarkdown(`❌ **Proje analizi yüklenemedi**

**Hata:** ${error instanceof Error ? error.message : 'Bilinmeyen hata'}

**Kontrol edilecek:**
- \`/public/docs/ProjectAnalysis.md\` dosyası mevcut mu?
- Dosya erişim izinleri uygun mu?
- Network bağlantısı çalışıyor mu?

**Geçici çözüm:** Dosyayı manuel olarak kontrol edin veya sayfayı yenileyin.`)
      toast.error('Proje analizi yüklenemedi!')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMarkdown()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">📋 Proje Durumu</h1>
            <p className="text-muted-foreground">
              AI Trading Platform'un güncel durumu ve geliştirme roadmap'i
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Son güncelleme: {lastUpdated}
            </span>
          )}
          <Button
            onClick={loadMarkdown}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5" />
            Proje Analizi Dokümanı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  // Custom styled components for better visual hierarchy
                  h1: ({children}) => (
                    <h1 className="text-2xl font-bold text-primary border-b border-border pb-2 mb-4">
                      {children}
                    </h1>
                  ),
                  h2: ({children}) => (
                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
                      {children}
                    </h2>
                  ),
                  h3: ({children}) => (
                    <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-primary pl-4 py-2 bg-muted rounded-r-md">
                      {children}
                    </blockquote>
                  ),
                  code: ({children, className}) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className={`block bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono ${className}`}>
                        {children}
                      </code>
                    )
                  },
                  pre: ({children}) => (
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      {children}
                    </pre>
                  ),
                  ul: ({children}) => (
                    <ul className="space-y-1 ml-6">
                      {children}
                    </ul>
                  ),
                  li: ({children}) => (
                    <li className="list-disc">
                      {children}
                    </li>
                  ),
                  table: ({children}) => (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-border">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({children}) => (
                    <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({children}) => (
                    <td className="border border-border px-4 py-2">
                      {children}
                    </td>
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Kaynak: /public/docs/ProjectAnalysis.md</span>
          </div>
          <div className="flex items-center gap-4">
            <span>React Markdown ile render edildi</span>
            <Button
              variant="ghost"
              size="sm" 
              className="gap-2 h-auto p-1"
              onClick={() => window.open('/docs/ProjectAnalysis.md', '_blank')}
            >
              <ExternalLink className="w-3 h-3" />
              Ham dosyayı aç
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}