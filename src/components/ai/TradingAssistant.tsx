import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, Car
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/co
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  Clock,
  CheckCircle,
  Dollar
  Calen
} from
import { bina
// Trading Assi
  id: string
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  DollarSign,
  Zap,
  Calendar,
  Brain
} from 'lucide-react'
import { aiService } from '../../services/aiService'
import { binanceService } from '../../services/binanceService'

// Trading Assistant için gerekli tipler
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  // Veriler
  const [liveStra

 

  // AI Trading Manager Sy
    return `Sen yap
1. PIYASA ANALİZİ:
- Teknik indikatörle

-

3. PORTFÖY YÖNETİMİ:
- Risk analizi ve po

- Hangi stratejilerin ç
- Risk yönetimi tavsiyele
5. İLETİŞİM:
-

- Toplam strateji sayısı: ${strategies.length}
- API durumu: ${
Her zaman objektif, veri tabanlı ve risk odaklı öneriler sun.`

  const sendMessage = async () => {


      content: inp
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

  // Veriler
  const [strategies] = useKV('trading-strategies', [])
  const [liveStrategies] = useKV('live-strategies', [])
  const [apiSettings] = useKV('api-settings', {})

  // Otomatik scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // AI Trading Manager System Prompt
  const getSystemPrompt = () => {
    return `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:

1. PIYASA ANALİZİ:
- Farklı zaman dilimlerinde (1D, 4H, 1H, 15M, 1M) tüm piyasa enstrümanlarını analiz etmek
- Teknik indikatörleri yorumlamak (RSI, MACD, Bollinger Bands, hareketli ortalamalar)
- Trend analizi yapmak ve destek/direnç seviyelerini belirlemek

2. EKONOMİK TAKVİM VE HABER ANALİZİ:
- Ekonomik takvimi takip edip yorumlamak
- Haber akışının piyasaya etkilerini değerlendirmek
- Volatilite artışı/azalışı tahminleri yapmak

3. PORTFÖY YÖNETİMİ:
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Risk analizi ve portföy çeşitlendirme önerileri
- Kar-zarar durumunu analiz etmek

4. STRATEJİ YÖNETİMİ:
- Hangi stratejilerin çalıştırılması/durdurulması gerektiğini tahmin etmek
- Piyasa koşullarına göre strateji önerileri
- Risk yönetimi tavsiyeleri

5. İLETİŞİM:
- Türkçe yanıtlar üretmek
- Anlaşılır ve net açıklamalar yapmak
- Profesyonel finansal terminoloji kullanmak

Mevcut durum:
- Toplam strateji sayısı: ${strategies.length}
- Aktif çalışan strateji sayısı: ${liveStrategies.length}
- API durumu: ${apiSettings?.binance?.enabled ? 'Bağlı' : 'Bağlı değil'}

Her zaman objektif, veri tabanlı ve risk odaklı öneriler sun.`
  }

  // Mesaj gönderme
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await aiService.generateResponse(
        </div>

       

              <div className="flex items-cent
                  <Bot className="h-5 w-
                </CardTitl
                  <Button
                    variant="o
                    disabled={isAnalyzing}
       

                    size="sm"
                    o
                    <DollarSign className="h-4 w
                  </Button>
              </div>

              {/* Mesajlar */}
                <div className
                    <di
       
                    </div>
               
                    <div
     
   

                           
                      >
                          <div className="flex
                            {message.type === 'suggestion' && <CheckCircle className="h-4 w-4" />}
                      
     
                              {message.type === 'warning' && 'Uyarı'}
                         
     
                        <div className="text-xs opacity-70 mt-2">
                       
     
                 
   

                         
                      </div>
                  )}
         

              <div 
                  {qui
                    
                      v
                     
      
                    </Button>


      
                  value={inputMessage}
                  placeholder="AI'a mesaj yazın... (örn:
                  disabled={isLoading}
                <Butto
                </Button>
            </CardContent>
        </div>
        {

            <CardHeader>

              </CardTitle>
            <CardContent>
                <div className="sp
                    <div k
                        <B
                          <Tre
                        
       
                        %{analysis.confidence}

                </div
                <p className="text-muted-fore
               
            </CardContent>

   

                Portföy
            </CardHeader>
         
                  <div className="flex justify-between
                    <span className="font-
                  <div className="flex justify-between">
                    <span 
                    </span>
                  <div className="flex justify-between">
                    <span className="font-medium">{portfolioSummary.ac
                </div>
                <p className="text-muted-foreground text-sm text-center py-4">
                </p>
           

         
       
                Strat
            </CardHeader>
     
   

                  <
                </div>
                  <span className="text-sm text-muted-
                </div>

                <Alert className="mt-4">
                  <AlertDescription>
                  </AlertDescription>
   

      </di
  )




        </div>




      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana Chat Alanı */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Trading Asistanı
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={performQuickAnalysis}
                    disabled={isAnalyzing}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    {isAnalyzing ? 'Analiz Ediliyor...' : 'Hızlı Analiz'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={getPortfolioSummary}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Portföy Özeti
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Mesajlar */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Merhaba! AI Trading Asistanınızım.</p>
                      <p>Piyasa analizi, strateji önerileri veya portföy değerlendirmesi için benimle konuşabilirsiniz.</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.role === 'assistant' && message.type && (
                          <div className="flex items-center gap-2 mb-2">
                            {message.type === 'analysis' && <BarChart3 className="h-4 w-4" />}
                            {message.type === 'suggestion' && <CheckCircle className="h-4 w-4" />}
                            {message.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                            {message.type === 'info' && <Bot className="h-4 w-4" />}
                            <Badge variant="outline" className="text-xs">
                              {message.type === 'analysis' && 'Analiz'}
                              {message.type === 'suggestion' && 'Öneri'}
                              {message.type === 'warning' && 'Uyarı'}
                              {message.type === 'info' && 'Bilgi'}
                            </Badge>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          <span>AI düşünüyor...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Hızlı Komutlar */}
              <div className="py-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickCommands.map((cmd, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => setInputMessage(cmd.text)}
                      className="text-xs"
                    >
                      <cmd.icon className="h-3 w-3 mr-1" />
                      {cmd.text}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mesaj Girişi */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="AI'a mesaj yazın... (örn: Piyasa durumu nasıl?)"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Yan Panel - Analizler */}
        <div className="space-y-6">
          {/* Piyasa Analizi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Zaman Dilimi Analizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {marketAnalysis.length > 0 ? (
                <div className="space-y-3">
                  {marketAnalysis.map((analysis, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{analysis.timeframe}</Badge>
                        {analysis.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        %{analysis.confidence}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Hızlı analiz yapmak için yukarıdaki butona tıklayın
                </p>
              )}
            </CardContent>
          </Card>

          {/* Portföy Özeti */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Portföy Durumu
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolioSummary ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Toplam Değer</span>
                    <span className="font-medium">${portfolioSummary.totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Kar/Zarar</span>
                    <span className={`font-medium ${portfolioSummary.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${portfolioSummary.pnl.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Aktif Pozisyon</span>
                    <span className="font-medium">{portfolioSummary.activePositions}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Portföy özeti için API bağlantısı gerekli
                </p>
              )}
            </CardContent>
          </Card>

          {/* Strateji Durumu */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Strateji Durumu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Toplam Strateji</span>
                  <span className="font-medium">{strategies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Çalışan Strateji</span>
                  <span className="font-medium text-green-500">{liveStrategies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bekleyen Strateji</span>
                  <span className="font-medium">{strategies.length - liveStrategies.length}</span>
                </div>
              </div>

              {!apiSettings?.binance?.enabled && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Binance API bağlantısı kapalı. Canlı trading için API ayarlarını yapılandırın.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}