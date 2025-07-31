import React, { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Zap,
  Clock,
  CheckCircle,
  Bot,
  Send,
  Tren
} from 'luc
import {
// Trading Assis
  id: string
  conten
  Bot,
  User,
  Send,
  Loader2,
  TrendingUp,
  Activity
} from 'lucide-react'
import { useKV } from '@github/spark/hooks'
import { aiService } from '@/services/aiService'

// Trading Assistant için gerekli tipler
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date



      // AI Prom
- Farklı zaman 
- Kullanıcının p
- Türkçe yanıtlar üretm
K

      // AI servisini çağır

        id: (Date.now() + 1).toString(),
        content: response,
      }
      setMessages(prev => [...prev, assistantMessage])
      console.error('AI yanıt hatası:', error)

        content: 'Üzgünüm, şu anda bir tekni
      }
    } finally {
    }

  const quickCommands = [
      label: "Piyasa Analizi",
      command: "Güncel piyasa durumunu analiz et 

      icon: <DollarSign className="w-4
    },
      label: "Risk 
      command: "Portföyümün 
    {
     


  const useQuickCommand
  }

    if (e
      sendMessage()
  }
  return (
      {/* Header */}
        <h1 className="text-2xl font-bold">AI Trading Yönetic
          Yapay zeka destekli trading asistanınız
      </div>

          <TabsTrigger value="cha



            {/* Sol Panel -
              <Card className="h-full flex flex-col">

                    AI Asistan Sohbeti
                </CardHeader>
                  {/* Mesa
                    <div c
                        <div 
       

                      
                     
                            message.role === '
                              : 'bg-muted
                            <div classNa
                          
                                <p className="whitespace-pre-wrap">{message.content}</p>
                             
       
                          </div>
               
                      {is
     
   

                   
                    </div
     
                  {/* Mesaj In
                    <Input
                      onChange={(e) => setInputMessage(e.target.value)}
      
     
                    <Button 
                      disabled={isLoading || !i
                    >
      
     
                    </Button
                </CardContent>
            </div>
      
     
                <Card>
                    <CardTitle className="tex
                  <CardContent>
     
   

  // Hızlı komut kullanma
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
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-6">
        <h1 className="text-2xl font-bold">AI Trading Yöneticisi</h1>
        <p className="text-muted-foreground mt-1">
          Yapay zeka destekli trading asistanınız
        </p>
      </div>

      <Tabs defaultValue="chat" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Sohbet</TabsTrigger>
          <TabsTrigger value="analysis">Analiz</TabsTrigger>
          <TabsTrigger value="insights">Öngörüler</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col mt-4">
          <div className="flex-1 flex gap-6">
            {/* Sol Panel - Sohbet */}
            <div className="flex-1">
              <Card className="h-full flex flex-col">
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
      </Tabs>
                          {cmd.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sistem Durumu */}
                <Card>

                    <CardTitle className="text-sm">Sistem Durumu</CardTitle>

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

                  </CardContent>



                <Card>

                    <CardTitle className="text-sm">AI Önerileri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Piyasa analizi için zaman dilimi belirtin</p>
                      <p>• Strateji önerileri ve optimizasyon</p>
                      <p>• Risk yönetimi tavsiyeleri</p>
                      <p>• Portföy dengeleme önerileri</p>
                    </div>

                </Card>

            </div>

        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 p-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />

                </CardTitle>

              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+2.4%</div>
                    <div className="text-sm text-muted-foreground">BTC/USDT</div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">-1.2%</div>
                    <div className="text-sm text-muted-foreground">ETH/USDT</div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+0.8%</div>
                    <div className="text-sm text-muted-foreground">BNB/USDT</div>

                </div>

            </Card>

            <Card>

                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Strateji Performansı

              </CardHeader>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aktif Stratejiler</span>

                  </div>

                    <span className="text-sm">Toplam Stratejiler</span>
                    <Badge variant="outline">{strategies.length}</Badge>
                  </div>

              </CardContent>

          </div>


        {/* Insights Tab */}
        <TabsContent value="insights" className="flex-1 p-4">

            <Alert>

              <AlertDescription>
                <strong>Ekonomik Takvim:</strong> Bu hafta Fed faiz kararı ve NFP verisi açıklanacak. 
                Yüksek volatilite bekleniyor.

            </Alert>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Önerisi:</strong> Mevcut piyasa koşullarında grid bot stratejileri 
                daha uygun görünüyor. Volatilite düşük seviyelerde.

            </Alert>

            <Alert>

              <AlertDescription>
                <strong>Risk Uyarısı:</strong> Portföy toplam değerinin %15'i tek bir varlıkta. 
                Çeşitlendirme önerilir.

            </Alert>

        </TabsContent>

    </div>

}