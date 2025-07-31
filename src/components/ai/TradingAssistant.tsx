import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  DollarSign,
  Zap,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Brain
} from 'lucide-react'
import { useKV } from '@github/spark/hooks'

// Trading Assistant için gerekli tipler
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Piyasa özet arayüzü
interface MarketSummary {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
}

export function TradingAssistant() {
  // Mesajlar için state
  const [messages, setMessages] = useState<Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>>([])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)})
 

  // KV storage'dan stratejileri al
  const [strategies] = useKV('trading-strategies', [])
  const [liveStrategies] = useKV('live-strategies', [])
  const [portfolioData] = useKV('portfolio-data', {})

  // AI Trading Manager System Prompt
  const getSystemPrompt = () => {
    return `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:

1. PIYASA ANALİZİ:
- Teknik indikatörlerle farklı zaman dilimlerinde (1D, 4H, 1H, 15M, 1M) analiz yap
- Trend, destek/direnç seviyelerini değerlendir
- Volatilite ve hacim analizleri sun

2. HABER & EKONOMIK TAKVİM:
- Önemli makroekonomik gelişmeleri takip et
- Merkez bankası kararları, NFP, CPI gibi verilerin etkilerini yorumla
- Haber akışındaki kritik gelişmeleri analiz et

3. PORTFÖY YÖNETİMİ:
- Risk analizi ve portföy optimizasyonu önerileri sun
- Kâr/zarar hesaplamalarını yap
- Pozisyon boyutlandırma tavsiyeleri ver

4. STRATEJİ YÖNETİMİ:
- Hangi stratejilerin çalıştırılması/durdurulması gerektiğini değerlendir
- Strateji performanslarını analiz et
- Piyasa koşullarına göre uygun strateji öner

5. İLETİŞİM:
- Açık ve anlaşılır finansal tavsiyelerde bulun
- Risk uyarılarını belirt
- Somut örneklerle açıkla

Mevcut durumda ${strategies.length} strateji hazır, ${liveStrategies.length} strateji çalışıyor.`
  }

  // Mesaj gönderme
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // AI'dan yanıt al
      const prompt = spark.llmPrompt`${getSystemPrompt()}

Kullanıcı sorusu: ${userMessage.content}

Lütfen Türkçe ve ayrıntılı yanıt ver.`

      const response = await spark.llm(prompt)

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI yanıt hatası:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      console.error('AI yanıt hatası:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Hızlı komutlar
  const quickCommands = [
    {
      label: "Piyasa Analizi",
      icon: <Activity className="w-4 h-4" />,
      command: "Bugünkü piyasa durumunu analiz et. BTC, ETH ve önemli altcoinlerin teknik analizini yap."
    },
    {
      label: "Portföy Durumu",
      icon: <DollarSign className="w-4 h-4" />,
      command: "Mevcut portföyümü analiz et ve risk değerlendirmesi yap."
    },
    {
      label: "Strateji Önerisi",
      icon: <Zap className="w-4 h-4" />,
      command: "Şu anki piyasa koşullarına göre hangi stratejileri çalıştırmalıyım?"
    },
    {
      label: "Risk Uyarısı",
   

                           
                      >
                          <div className="flex
                            {message.type === 'suggestion' && <CheckCircle className="h-4 w-4" />}
                      
     
                              {message.type === 'warning' && 'Uyarı'}
                         
     
                        <div className="text-xs opacity-70 mt-2">
                       
     
                 
   

                         
                      </div>
                  )}
• Strateji önerileri ve optimizasyon

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
           

         
       
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 px-1">
                      {message.timestamp.toLocaleTimeString('tr-TR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Düşünüyor...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Commands */}
          <div className="border-t p-4">
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-2">Hızlı Komutlar:</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickCommands.map((cmd, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs h-8"
                    onClick={() => setInputMessage(cmd.command)}
                  >
                    {cmd.icon}
                    <span className="ml-1 truncate">{cmd.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="AI Trading Yöneticisi ile sohbet edin..."
                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 p-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Piyasa Durumu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+2.4%</div>
                    <div className="text-sm text-muted-foreground">BTC/USDT</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">-1.2%</div>
                    <div className="text-sm text-muted-foreground">ETH/USDT</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+0.8%</div>
                    <div className="text-sm text-muted-foreground">BNB/USDT</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Strateji Performansı
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aktif Stratejiler</span>
                    <Badge variant="secondary">{liveStrategies.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toplam Stratejiler</span>
                    <Badge variant="outline">{strategies.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="flex-1 p-4">
          <div className="space-y-4">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Ekonomik Takvim:</strong> Bu hafta Fed faiz kararı ve NFP verisi açıklanacak. 
                Yüksek volatilite bekleniyor.
              </AlertDescription>
            </Alert>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Önerisi:</strong> Mevcut piyasa koşullarında grid bot stratejileri 
                daha uygun görünüyor. Volatilite düşük seviyelerde.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Risk Uyarısı:</strong> Portföy toplam değerinin %15'i tek bir varlıkta. 
                Çeşitlendirme önerilir.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
    return `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:

1. PIYASA ANALİZİ:
- Teknik indikatörlerle farklı zaman dilimlerinde (1D, 4H, 1H, 15M, 1M) analiz yap
- Trend, destek/direnç seviyelerini değerlendir
- Volatilite ve hacim analizleri sun

2. HABER & EKONOMIK TAKVİM:
- Önemli makroekonomik gelişmeleri takip et
- Merkez bankası kararları, NFP, CPI gibi verilerin etkilerini yorumla
- Haber akışındaki kritik gelişmeleri analiz et

3. PORTFÖY YÖNETİMİ:
- Risk analizi ve portföy optimizasyonu önerileri sun
- Kâr/zarar hesaplamalarını yap
- Pozisyon boyutlandırma tavsiyeleri ver

4. STRATEJİ YÖNETİMİ:
- Hangi stratejilerin çalıştırılması/durdurulması gerektiğini değerlendir
- Strateji performanslarını analiz et
- Piyasa koşullarına göre uygun strateji öner

5. İLETİŞİM:
- Açık ve anlaşılır finansal tavsiyelerde bulun
- Risk uyarılarını belirt
- Somut örneklerle açıkla

Mevcut durumda ${strategies.length} strateji hazır, ${liveStrategies.length} strateji çalışıyor.`
  }

  // Mesaj gönderme
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // AI'dan yanıt al
      const prompt = spark.llmPrompt`${getSystemPrompt()}

Kullanıcı sorusu: ${userMessage.content}

Lütfen Türkçe ve ayrıntılı yanıt ver.`

      const response = await spark.llm(prompt)

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI yanıt hatası:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Hızlı komutlar
  const quickCommands = [
    {
      label: "Piyasa Analizi",
      icon: <Activity className="w-4 h-4" />,
      command: "Bugünkü piyasa durumunu analiz et. BTC, ETH ve önemli altcoinlerin teknik analizini yap."
    },
    {
      label: "Portföy Durumu",
      icon: <DollarSign className="w-4 h-4" />,
      command: "Mevcut portföyümü analiz et ve risk değerlendirmesi yap."
    },
    {
      label: "Strateji Önerisi",
      icon: <Brain className="w-4 h-4" />,
      command: "Mevcut piyasa koşullarına göre hangi stratejileri çalıştırmalıyım?"
    },
    {
      label: "Risk Uyarısı",
      icon: <AlertTriangle className="w-4 h-4" />,
      command: "Portföyümde hangi riskler var? Dikkat etmem gereken noktalar neler?"
    }
  ]

  // Hızlı komut kullanımı
  const useQuickCommand = (command: string) => {
    setInputMessage(command)
  }

  // Enter tuşu ile mesaj gönderme
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col p-6 bg-background">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Bot className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">AI Trading Yöneticisi</h1>
        </div>
        <p className="text-muted-foreground">
          Yapay zeka destekli trading asistanınız. Piyasa analizi, strateji önerileri ve portföy yönetimi için sorular sorun.
        </p>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Sol Panel - Sohbet */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Asistan Sohbeti
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Mesajlar */}
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Merhaba! Ben AI Trading Yöneticinizim.</p>
                      <p>Size piyasa analizi, strateji önerileri ve portföy yönetimi konularında yardımcı olabilirim.</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="flex items-start gap-2">
                          {message.role === 'assistant' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                          {message.role === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <div className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString('tr-TR')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>AI düşünüyor...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Mesaj Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="AI'a mesaj yazın... (örn: 'BTC'nin teknik analizini yap')"
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Panel - Hızlı Komutlar ve Bilgiler */}
        <div className="w-80">
          <div className="space-y-4">
            {/* Hızlı Komutlar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Hızlı Komutlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickCommands.map((cmd, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => useQuickCommand(cmd.command)}
                      className="w-full justify-start gap-2"
                    >
                      {cmd.icon}
                      {cmd.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sistem Durumu */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sistem Durumu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Toplam Strateji</span>
                    <Badge variant="secondary">{strategies.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Çalışan Strateji</span>
                    <Badge variant="default">{liveStrategies.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Durumu</span>
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Aktif
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Öneriler */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Önerileri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Piyasa analizi için zaman dilimi belirtin</p>
                  <p>• Strateji önerileri ve optimizasyon</p>
                  <p>• Risk yönetimi tavsiyeleri</p>
                  <p>• Portföy dengeleme önerileri</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}