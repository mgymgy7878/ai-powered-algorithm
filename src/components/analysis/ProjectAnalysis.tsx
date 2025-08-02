import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download, ExternalLink } from 'lucide-react'
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
      const content = await response.text()
      setMarkdown(content)
      setLastUpdated(new Date().toLocaleString('tr-TR'))
      toast.success('Proje analizi başarıyla yüklendi')
    } catch (error) {
      console.error('Markdown dosyası yüklenirken hata:', error)
      setMarkdown(`
# ❌ Dosya Yüklenirken Hata Oluştu

**Hata:** ${error instanceof Error ? error.message : 'Bilinmeyen hata'}

**Olası Nedenler:**
- \`/public/docs/ProjectAnalysis.md\` dosyası mevcut değil
- Dosya izinleri yetersiz
- Network bağlantı sorunu

**Çözüm:**
1. Dosyanın \`/public/docs/\` klasöründe olduğundan emin olun
2. Tarayıcı geliştirici araçlarından Network sekmesini kontrol edin
3. Sayfayı yenilemeyi deneyin

**Geçici Çözüm:** Dosya manuel olarak oluşturulabilir veya GitHub repository'den kopyalanabilir.
      `)
      toast.error('Proje analizi yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMarkdown()
  }, [])

  const downloadMarkdown = () => {
    try {
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ProjectAnalysis.md'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Dosya indirildi')
    } catch (error) {
      toast.error('Dosya indirilemedi')
    }
  }

  const openInNewTab = () => {
    window.open('/docs/ProjectAnalysis.md', '_blank')
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              📋
            </div>
            <div>
              <h1 className="text-xl font-semibold">Proje Durumu</h1>
              <p className="text-sm text-muted-foreground">
                Geliştirme analizi ve teknik dokümentasyon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {lastUpdated && (
              <Badge variant="outline" className="text-xs">
                Son güncelleme: {lastUpdated}
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={loadMarkdown}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Yenile
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={downloadMarkdown}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              İndir
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ham Dosya
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-4">
        <Card className="h-full">
          <CardContent className="p-0 h-full">
            <ScrollArea className="h-full">
              <div className="p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      // Özel component renderları
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-4 pb-2 border-b text-foreground">
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
                      p: ({ children }) => (
                        <p className="mb-4 text-muted-foreground leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-4 ml-4 space-y-1">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-muted-foreground">
                          {children}
                        </li>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className
                        if (isInline) {
                          return (
                            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                              {children}
                            </code>
                          )
                        }
                        return (
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto mb-4">
                            <code className="text-sm font-mono text-foreground">
                              {children}
                            </code>
                          </pre>
                        )
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
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
                        <th className="border border-border bg-muted px-3 py-2 text-left font-medium text-foreground">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-border px-3 py-2 text-muted-foreground">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}