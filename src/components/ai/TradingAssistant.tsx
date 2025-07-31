import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Input } from '@/components/ui/input'
  Bot, 
import { Badge } from '@/components/ui/badge'
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  role: 'user' | 'assistant'
import { 

  User,
  const
  Loader2, 
    messa
  TrendingUp,
  const sendMess
  DollarSign,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  AlertTriangle
} from 'lucide-react'
import { useKV } from '@github/spark/hooks'
import { aiService } from '@/services/aiService'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function TradingAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [strategies] = useKV('trading-strategies', [])
  const [liveStrategies] = useKV('live-strategies', [])

  const quickCommands = [
    { label: 'Piyasa Analizi (1H)', icon: TrendingUp, command: 'BTC ve ETH için 1 saatlik teknik analiz yap' },
    { label: 'Strateji Önerisi', icon: Brain, command: 'Mevcut piyasa koşullarına uygun strateji öner' },
    { label: 'Risk Analizi', icon: AlertTriangle, command: 'Portföy risk analizimi yap' },
    { label: 'Günlük Özet', icon: Activity, command: 'Bugün için piyasa özetini ver' }
  r

      </div>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // AI mesaj gönderme fonksiyonu
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

         
                  <span className="text-sm">AI düşün
              </div>
          )}
        <div ref={messagesEndRef} />
      
        <div className="flex gap-2">
            value={inputM

            disabled={isLoading}

            onClick={sendMessage}

            {isLoading ? (

            )}

    </Card>
}




















































        <TabsList className="mx-6 mt-4">

          <TabsTrigger value="analysis">Analiz</TabsTrigger>

        </TabsList>

        {/* Chat Tab */}

          <div className="flex-1 flex gap-6">





                    <Brain className="w-5 h-5" />





















                          }`}>











                        </div>











                      )}





                  <div className="flex gap-2">











                      size="icon"













            <div className="w-80">

                {/* Hızlı Komutlar */}













                        >



                      ))}

                  </CardContent>



                <Card>





                      <div className="flex items-center justify-between">

                        <Badge variant="secondary">{strategies.length}</Badge>



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

                {/* AI Önerileri */}
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
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 p-6">
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
                    <Badge variant="default">{liveStrategies.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toplam Stratejiler</span>
                    <Badge variant="secondary">{strategies.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="flex-1 p-6">
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Volatilite Uyarısı:</strong> BTC/USDT çiftinde son 4 saatte %3+ hareket gözlendi. 
                Yüksek volatilite bekleniyor.
              </AlertDescription>
            </Alert>

            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Önerisi:</strong> Mevcut piyasa koşullarında grid bot stratejileri 
                daha uygun görünüyor. Volatilite düşük seviyelerde.
              </AlertDescription>
            </Alert>

            <Alert>
              <DollarSign className="h-4 w-4" />
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