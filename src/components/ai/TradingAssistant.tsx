import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/but
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
  Bot, 
  Loader2, 
  Brain, 
  TrendingDown, 
  DollarS
  Check
  Clock,
  Zap
import {
interface
  role: 'user'
  timestamp: Dat

  const [messa
  const [isLoadi
  const [liveS

  const 
    { lab
    {

  useEffect(() => {

  // AI mesaj gönderme 
    if (!inp
    const userMessage: ChatM
      role: 'user
      timestamp: 



      // AI sistem promptu - Türkçe trading asistanı
- Farklı zaman dilimlerinde (1D, 4H, 1H, 15M, 1M) tüm 
- Kullanıcının portföyünü değerlendirerek özet çıka
- Türkçe yanıtlar üretmek
Kullanıcıya profesyonel, anlaşılır ve eyleme dönük öneriler sun.`
      const prompt = spark.llmPrompt`${systemPrompt}

Lütfen detaylı ve y
      const response = aw
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        timestamp: new Date()
      
   

        id: (Date.now() + 1).toS
        content: 'Ü
      }
    } finally {


    setInputMessage(command)
      sendMessage()

  const handleKeyPress = (e: React.Key
      e.preventDefault()
    }

    <div className="flex fl
     

          </div>
            <h1 classNa
          </div>

      <Ta
          <TabsTrigger value="chat">Sohbet</TabsTrig
          <TabsTrigger value="insights">Öngörüler</TabsTrigger>

        <TabsContent value="chat" className="flex-1 p-4">
            {/* Ana Sohbet Alanı */}
              <Card className="h-[600px] flex flex-col">
                  <CardTi

                </CardHeader>

                    <div className="space-y-4">

                          <p>Merhaba! Be

                      

                            message.role === '
      
                            <div className="f
                              {message.r
                          
                          
                             
       
      
                      {isLoading && (
      
                     
                            </div>
                        </div>
                    </div>
                  </Scroll
                  {/* Mesaj Input */}
                    <Input
       
                      placeholder="AI'a mesaj yazı
               
                    <Butt
     
   

                        <Send className="w-4 h-4
                    </Button
                </Card
            </div>
           
   

                    <CardTitle className="text-sm">Hız
                  <CardContent>
                      {q
                   
     
   

          
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">AI Trading Yöneticisi</h1>
            <p className="text-sm text-muted-foreground">Yapay zeka destekli trading asistanınız</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="mx-6 mt-4">
          <TabsTrigger value="chat">Sohbet</TabsTrigger>
          <TabsTrigger value="analysis">Analiz</TabsTrigger>
          <TabsTrigger value="insights">Öngörüler</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 p-6">
          <div className="flex-1 flex gap-6">
            {/* Ana Sohbet Alanı */}
            <div className="flex-1">
              <Card className="h-[calc(100vh-200px)] flex flex-col">
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
                          <cmd.icon className="w-4 h-4" />
                          {cmd.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>


                <Card>

                    <CardTitle className="text-sm">Sistem Durumu</CardTitle>

                  <CardContent>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Toplam Strateji</span>
                        <Badge variant="secondary">{strategies.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">

                        <Badge variant="default">{liveStrategies.length}</Badge>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Durumu</span>
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aktif
                        </Badge>
                      </div>
                    </div>
                  </CardContent>



                <Card>

                    <CardTitle className="text-sm">AI Önerileri</CardTitle>

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

        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 p-6">
          <div className="grid gap-4">

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

                  Strateji Performansı

              </CardHeader>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aktif Stratejiler</span>
                    <Badge variant="default">{liveStrategies.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toplam Stratejiler</span>

                  </div>

              </CardContent>

          </div>



        <TabsContent value="insights" className="flex-1 p-6">
          <div className="space-y-4">
            <Alert>

              <AlertDescription>

                Yüksek volatilite bekleniyor.

            </Alert>

            <Alert>

              <AlertDescription>
                <strong>AI Önerisi:</strong> Mevcut piyasa koşullarında grid bot stratejileri 
                daha uygun görünüyor. Volatilite düşük seviyelerde.

            </Alert>

            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                <strong>Risk Uyarısı:</strong> Portföy toplam değerinin %15'i tek bir varlıkta. 
                Çeşitlendirme önerilir.
              </AlertDescription>
            </Alert>

        </TabsContent>

    </div>

}