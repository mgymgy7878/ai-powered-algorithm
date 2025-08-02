import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Wifi, WifiOff, Activity, AlertCircle } from 'lucide-react'

const WebSocketTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [messages, setMessages] = useState<Array<{ id: string, data: any, timestamp: Date }>>([])
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null)

  const connectToWebSocket = () => {
    try {
      setConnectionStatus('connecting')
      // Binance WebSocket stream örneği
      const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker')
      
      ws.onopen = () => {
        console.log('✅ WebSocket bağlantısı açıldı')
        setConnectionStatus('connected')
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const newMessage = {
            id: Date.now().toString(),
            data: data,
            timestamp: new Date()
          }
          setMessages(prev => [newMessage, ...prev.slice(0, 9)]) // Son 10 mesajı sakla
        } catch (error) {
          console.error('WebSocket mesaj parse hatası:', error)
        }
      }
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket hatası:', error)
        setConnectionStatus('disconnected')
      }
      
      ws.onclose = () => {
        console.log('🔌 WebSocket bağlantısı kapandı')
        setConnectionStatus('disconnected')
      }
      
      setWsInstance(ws)
    } catch (error) {
      console.error('WebSocket bağlantı hatası:', error)
      setConnectionStatus('disconnected')
    }
  }

  const disconnectWebSocket = () => {
    if (wsInstance) {
      wsInstance.close()
      setWsInstance(null)
    }
    setConnectionStatus('disconnected')
    setMessages([])
  }

  useEffect(() => {
    return () => {
      if (wsInstance) {
        wsInstance.close()
      }
    }
  }, [wsInstance])

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600'
      case 'connecting': return 'text-yellow-600'
      case 'disconnected': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="w-4 h-4" />
      case 'connecting': return <Activity className="w-4 h-4 animate-spin" />
      case 'disconnected': return <WifiOff className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📡 WebSocket Test</h1>
      <p className="mt-4 text-muted-foreground">
        Gerçek zamanlı veri akışı test sayfası. Binance WebSocket bağlantısını test edebilirsiniz.
      </p>
      
      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Bağlantı Durumu
              <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'} className={getStatusColor()}>
                {connectionStatus === 'connected' ? 'Bağlı' : 
                 connectionStatus === 'connecting' ? 'Bağlanıyor...' : 'Bağlı Değil'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={connectToWebSocket} 
                disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'}
                variant="default"
              >
                Bağlan
              </Button>
              <Button 
                onClick={disconnectWebSocket} 
                disabled={connectionStatus === 'disconnected'}
                variant="outline"
              >
                Bağlantıyı Kes
              </Button>
            </div>
            
            {connectionStatus === 'connected' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Binance WebSocket'e başarıyla bağlandı. BTCUSDT ticker verisi alınıyor.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gelen Mesajlar ({messages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm">Henüz mesaj alınmadı.</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="p-3 bg-muted rounded-lg text-xs">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-green-600">#{message.id}</span>
                      <span className="text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(message.data, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WebSocketTest