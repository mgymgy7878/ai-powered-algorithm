import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scr
import { Alert, AlertDescription } from '@/co
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  DollarS
  Calend
  AlertTria
  Brain
import {
// Trading Ass
  id: string
  content: 
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
1


- Önemli makroekonomik ge
- Haber akışında
3. PORTFÖY YÖNE
- Kâr/zarar hesa

- Hangi strateji
-

- Risk uyarılarını belirt

  }
  // Mesaj gönderme
    if (!inputMessage.trim() || isLoading) return
    const userMessage: ChatMessage = {

      timestamp: new Date()

    setInputMessage('')







        content: response,
      }
      setMessages(prev => [...prev, assistantMessage])

      const errorM
        role: 'assistant',
        timestamp: new Date()


    }

  const quickCommands = [
      label: "Piyasa Analizi",

    {
      icon: <DollarSign className="w-4 h-4" />,
    },
      label: "Strateji Önerisi",

    {
      icon: <AlertTriangle className="w-4 h-4" />,
    }


  }
  // Enter tuşu ile mesaj gönderme
    if (e.key === 'Enter'
      sendMessage()

  return (
   

          <h1 class
        <p className="text-muted-fo
        </p>

        <TabsList className="grid w-fu
          <TabsTrigger value="an
        </TabsList>
        {/* Chat Tab */}
          <div className="f
     

                    <Brain className="w-5 h-5" 
                  </Car
                <CardC

         
                        
                          <p>Size piyasa analizi, stratej

                      {messages.map((mes

                              ? 'bg-pr

                              {message.role ==

                                <div classNam
                                </div>
                          
                        </
                      
      }

                              <span>AI düşünüyor...</s
                     
                      )}
      

                  <div className="flex g
        role: 'assistant',
                      onKeyPress={handleKeyPress}
        timestamp: new Date()
       

                      size="icon"
               
                      ) :
    }
   


  const quickCommands = [
     
      label: "Piyasa Analizi",
                  </CardHeader>
                    <div className="space-y-2">
      
    {
                          onCl
      icon: <DollarSign className="w-4 h-4" />,
                          {cmd.label}
    },
     
      label: "Strateji Önerisi",
                <Card>
                    <CardTitle className="text-sm">Sistem Durumu</CardTitle>
      
    {
                        <Bad
      icon: <AlertTriangle className="w-4 h-4" />,
                        <Badge variant="default">{liveStrategies.length}</Badge>
    }
   

                      </di
                  </CardContent>

  }

  // Enter tuşu ile mesaj gönderme
                      <p>• Piyasa analizi için zaman d
                      <p>• Risk yönetimi ta
                    </di
      sendMessage()
     
   

  return (
              <CardHeader>
                  <T
                </CardTitle>
              <CardContent>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">BTC/
        </div>
                    <div className="text-sm t
                  <div className="text-center">
            
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



                      ))}
                      
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>AI düşünüyor...</span>
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
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 p-4">
          <div className="grid gap-4">


                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Piyasa Durumu
                </CardTitle>


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







                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Strateji Performansı
                </CardTitle>


                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aktif Stratejiler</span>
                    <Badge variant="secondary">{liveStrategies.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toplam Stratejiler</span>
                    <Badge variant="outline">{strategies.length}</Badge>
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


