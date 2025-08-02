import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { AppView } from '../App'

interface DebugPageProps {
  currentView?: AppView
  onViewChange?: (view: AppView) => void
}

const DebugPage: React.FC<DebugPageProps> = ({ currentView, onViewChange }) => {
  const [windowState, setWindowState] = useState<any>({})
  const [notificationTest, setNotificationTest] = useState('')

  useEffect(() => {
    // Window durumunu kontrol et
    const checkWindow = () => {
      setWindowState({
        pushNotification: typeof (window as any).pushNotification,
        location: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    }

    checkWindow()
    const interval = setInterval(checkWindow, 2000)
    return () => clearInterval(interval)
  }, [])

  const testNotification = () => {
    const message = `Test bildirimi: ${new Date().toLocaleTimeString('tr-TR')}`
    if (typeof (window as any).pushNotification === 'function') {
      ;(window as any).pushNotification(message, 'info')
      setNotificationTest('✅ Bildirim gönderildi')
    } else {
      setNotificationTest('❌ pushNotification fonksiyonu bulunamadı')
    }
  }

  const allViews: AppView[] = [
    'dashboard', 'strategies', 'backtest', 'live', 'portfolio', 
    'analysis', 'economic', 'summary', 'settings', 'project-analysis', 
    'test', 'websocket-test', 'a-page', 'debug'
  ]

  return (
    <div className="p-6 space-y-6 h-screen bg-red-50">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-red-600">🔴 DEBUG SAYFASI</h1>
        <p className="text-lg mt-2">
          Bu sayfa sistem durumunu ve hataları kontrol etmek için oluşturulmuştur.
        </p>
      </div>

      {/* Mevcut View Bilgisi */}
      <Card>
        <CardHeader>
          <CardTitle>Sayfa Durumu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <strong>Mevcut View:</strong>
            <Badge variant="default">{currentView || 'bilinmiyor'}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <strong>URL:</strong>
            <code className="text-xs bg-muted px-2 py-1 rounded">{windowState.location}</code>
          </div>
        </CardContent>
      </Card>

      {/* Bildirim Sistemi Testi */}
      <Card>
        <CardHeader>
          <CardTitle>Bildirim Sistemi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <strong>pushNotification Durumu:</strong>
            <Badge variant={windowState.pushNotification === 'function' ? 'default' : 'destructive'}>
              {windowState.pushNotification || 'undefined'}
            </Badge>
          </div>
          <Button onClick={testNotification} variant="outline">
            Bildirim Testi Gönder
          </Button>
          {notificationTest && (
            <p className="text-sm">{notificationTest}</p>
          )}
        </CardContent>
      </Card>

      {/* Navigation Testi */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Test - Tüm Sayfalar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {allViews.map((view) => (
              <Button
                key={view}
                variant={currentView === view ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  console.log(`🔗 Debug page - Navigating to: ${view}`)
                  if (onViewChange) {
                    onViewChange(view)
                  } else {
                    console.error('onViewChange is not provided')
                  }
                }}
                className="text-xs"
              >
                {view}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sistem Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle>Sistem Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <div><strong>User Agent:</strong> {windowState.userAgent}</div>
            <div><strong>Son Güncelleme:</strong> {windowState.timestamp}</div>
            <div><strong>React Mode:</strong> {process.env.NODE_ENV}</div>
            <div><strong>Sayfa Yükleme Zamanı:</strong> {new Date().toLocaleString('tr-TR')}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DebugPage
