import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Bot, TestTube, CheckCircle, X, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { aiService } from '@/services/aiService'

export function AITestPanel() {
  const [testInput, setTestInput] = useState('Basit bir RSI stratejisi oluştur')
  const [testOutput, setTestOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')

  const testAIConnection = async () => {
    setIsLoading(true)
    setApiStatus('testing')
    
    try {
      const config = aiService.getConfig()
      
      if (!config.openaiApiKey && !config.anthropicApiKey) {
        throw new Error('API anahtarı bulunamadı')
      }

      const response = await aiService.generalQuestion('Merhaba, çalışıyor musun?')
      
      if (response.content) {
        setApiStatus('success')
        setTestOutput(`✅ AI Bağlantısı Başarılı!\n\nModel: ${response.model}\nYanıt: ${response.content}`)
        toast.success('AI API bağlantısı başarılı')
      } else {
        throw new Error('Boş yanıt alındı')
      }
    } catch (error: any) {
      setApiStatus('error')
      setTestOutput(`❌ Bağlantı Hatası: ${error.message}`)
      toast.error(`AI test hatası: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testStrategyGeneration = async () => {
    if (!testInput.trim()) return
    
    setIsLoading(true)
    
    try {
      const response = await aiService.generateStrategyCode(testInput)
      setTestOutput(`✅ Strateji Oluşturuldu!\n\nModel: ${response.model}\n\n${response.content}`)
      toast.success('Strateji başarıyla oluşturuldu')
    } catch (error: any) {
      setTestOutput(`❌ Strateji Oluşturma Hatası: ${error.message}`)
      toast.error(`Hata: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'testing':
        return <Bot className="w-4 h-4 animate-pulse" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <X className="w-4 h-4 text-red-500" />
      default:
        return <TestTube className="w-4 h-4" />
    }
  }

  const getStatusBadge = () => {
    switch (apiStatus) {
      case 'testing':
        return <Badge variant="secondary" className="animate-pulse">Test ediliyor...</Badge>
      case 'success':
        return <Badge variant="default" className="bg-green-500">Bağlı</Badge>
      case 'error':
        return <Badge variant="destructive">Hata</Badge>
      default:
        return <Badge variant="outline">Hazır</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            AI API Test Paneli
            {getStatusBadge()}
          </CardTitle>
          <CardDescription>
            AI entegrasyonunu test edin ve API bağlantısını doğrulayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Test */}
          <div className="space-y-2">
            <h3 className="font-medium">1. Bağlantı Testi</h3>
            <Button 
              onClick={testAIConnection}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading && apiStatus === 'testing' ? 'Test ediliyor...' : 'AI Bağlantısını Test Et'}
            </Button>
          </div>

          <Separator />
          
          {/* Strategy Generation Test */}
          <div className="space-y-2">
            <h3 className="font-medium">2. Strateji Oluşturma Testi</h3>
            <Input
              placeholder="Strateji talebinizi yazın..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              onClick={testStrategyGeneration}
              disabled={isLoading || !testInput.trim()}
              className="w-full"
            >
              {isLoading && apiStatus !== 'testing' ? 'Strateji oluşturuluyor...' : 'Strateji Oluştur'}
            </Button>
          </div>

          <Separator />

          {/* Output */}
          <div className="space-y-2">
            <h3 className="font-medium">Test Sonucu</h3>
            <Textarea
              placeholder="Test sonuçları burada görünecek..."
              value={testOutput}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* Current Config Info */}
          <div className="bg-muted p-3 rounded-lg text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Warning className="w-4 h-4 text-amber-500" />
              <span className="font-medium">Mevcut Yapılandırma</span>
            </div>
            <div className="text-muted-foreground">
              {(() => {
                const config = aiService.getConfig()
                const hasOpenAI = !!config.openaiApiKey
                const hasAnthropic = !!config.anthropicApiKey
                
                if (!hasOpenAI && !hasAnthropic) {
                  return '❌ API anahtarı bulunamadı. Ayarlardan API anahtarınızı girin.'
                }
                
                return (
                  <div className="space-y-1">
                    {hasOpenAI && <div>✅ OpenAI API anahtarı tanımlı</div>}
                    {hasAnthropic && <div>✅ Anthropic API anahtarı tanımlı</div>}
                    <div>🎯 Tercih edilen model: {config.preferredModel}</div>
                    <div>🌡️ Temperature: {config.temperature}</div>
                    <div>📊 Max tokens: {config.maxTokens}</div>
                  </div>
                )
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}