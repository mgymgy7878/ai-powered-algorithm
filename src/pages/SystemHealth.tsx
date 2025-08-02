import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { AppView } from '../App'

interface SystemCheck {
  id: string
  name: string
  status: 'checking' | 'success' | 'error' | 'warning'
  message: string
  details?: string
}

export default function SystemHealth() {
  const [checks, setChecks] = useState<SystemCheck[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const systemChecks = [
    {
      id: 'react',
      name: 'React Render',
      test: () => {
        return { success: true, message: 'React bileşeni başarıyla render edildi' }
      }
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      test: () => {
        const element = document.createElement('div')
        element.className = 'bg-red-500'
        document.body.appendChild(element)
        const styles = window.getComputedStyle(element)
        const hasStyles = styles.backgroundColor === 'rgb(239, 68, 68)' || styles.backgroundColor.includes('239')
        document.body.removeChild(element)
        return { 
          success: hasStyles, 
          message: hasStyles ? 'Tailwind CSS yüklü ve çalışıyor' : 'Tailwind CSS yüklenemedi'
        }
      }
    },
    {
      id: 'localStorage',
      name: 'Local Storage',
      test: () => {
        try {
          localStorage.setItem('test', 'test')
          const value = localStorage.getItem('test')
          localStorage.removeItem('test')
          return { 
            success: value === 'test', 
            message: 'Local Storage erişilebilir' 
          }
        } catch {
          return { 
            success: false, 
            message: 'Local Storage erişim hatası' 
          }
        }
      }
    },
    {
      id: 'console',
      name: 'Console API',
      test: () => {
        try {
          console.log('System health check')
          return { 
            success: true, 
            message: 'Console API çalışıyor' 
          }
        } catch {
          return { 
            success: false, 
            message: 'Console API hatası' 
          }
        }
      }
    },
    {
      id: 'events',
      name: 'Custom Events',
      test: () => {
        try {
          const event = new CustomEvent('test-event')
          window.dispatchEvent(event)
          return { 
            success: true, 
            message: 'Custom event sistemi çalışıyor' 
          }
        } catch {
          return { 
            success: false, 
            message: 'Custom event sistemi hatası' 
          }
        }
      }
    },
    {
      id: 'navigation',
      name: 'Navigation System',
      test: () => {
        try {
          // Sidebar navigation test
          const navigationEvent = new CustomEvent('sidebar-navigation-test', {
            detail: { viewId: 'dashboard' }
          })
          window.dispatchEvent(navigationEvent)
          return { 
            success: true, 
            message: 'Navigation sistemi hazır' 
          }
        } catch {
          return { 
            success: false, 
            message: 'Navigation sistemi hatası' 
          }
        }
      }
    }
  ]

  const runHealthCheck = async () => {
    setIsRunning(true)
    setChecks([])

    for (const check of systemChecks) {
      // İlk olarak "checking" durumunu göster
      setChecks(prev => [...prev, {
        id: check.id,
        name: check.name,
        status: 'checking',
        message: 'Kontrol ediliyor...'
      }])

      // Kısa bir delay ekle
      await new Promise(resolve => setTimeout(resolve, 300))

      try {
        const result = check.test()
        setChecks(prev => prev.map(c => 
          c.id === check.id 
            ? {
                ...c,
                status: result.success ? 'success' : 'error',
                message: result.message,
                details: result.details
              }
            : c
        ))
      } catch (error) {
        setChecks(prev => prev.map(c => 
          c.id === check.id 
            ? {
                ...c,
                status: 'error',
                message: `Test hatası: ${error.message}`,
                details: error.stack
              }
            : c
        ))
      }
    }

    setIsRunning(false)
  }

  const getStatusBadge = (status: SystemCheck['status']) => {
    switch (status) {
      case 'checking':
        return <Badge className="bg-yellow-100 text-yellow-800">🔄 Kontrol Ediliyor</Badge>
      case 'success':
        return <Badge className="bg-green-100 text-green-800">✅ Başarılı</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">❌ Hata</Badge>
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800">⚠️ Uyarı</Badge>
      default:
        return <Badge variant="outline">⌛ Bekleniyor</Badge>
    }
  }

  const successCount = checks.filter(c => c.status === 'success').length
  const errorCount = checks.filter(c => c.status === 'error').length
  const totalCount = systemChecks.length

  useEffect(() => {
    // Sayfa açıldığında otomatik test çalıştır
    runHealthCheck()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🏥 Sistem Sağlık Kontrolü</h1>
        <p className="text-muted-foreground">
          Uygulamanın temel bileşenlerinin çalışma durumunu kontrol edin
        </p>
      </div>

      {/* Özet Bilgiler */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Özeti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 items-center">
            <div className="text-sm">
              <span className="font-medium">Toplam Test:</span> {totalCount}
            </div>
            <div className="text-sm text-green-600">
              <span className="font-medium">Başarılı:</span> {successCount}
            </div>
            <div className="text-sm text-red-600">
              <span className="font-medium">Hatalı:</span> {errorCount}
            </div>
            <div className="text-sm text-blue-600">
              <span className="font-medium">Başarı Oranı:</span> {totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Kontrolleri */}
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={runHealthCheck} 
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isRunning ? '🔄 Test Çalışıyor...' : '🚀 Sağlık Kontrolü Başlat'}
        </Button>
        <Button 
          onClick={() => setChecks([])} 
          variant="outline"
          disabled={isRunning}
        >
          🧹 Sonuçları Temizle
        </Button>
      </div>

      {/* Test Sonuçları */}
      <div className="space-y-4">
        {checks.map((check) => (
          <Card key={check.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{check.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {check.message}
                  </p>
                  {check.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        Detayları Göster
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                        {check.details}
                      </pre>
                    </details>
                  )}
                </div>
                {getStatusBadge(check.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sistem Bilgileri */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🔧 Sistem Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">User Agent:</span>
              <div className="text-muted-foreground mt-1 break-all">
                {navigator.userAgent}
              </div>
            </div>
            <div>
              <span className="font-medium">Viewport:</span>
              <div className="text-muted-foreground mt-1">
                {window.innerWidth} x {window.innerHeight}
              </div>
            </div>
            <div>
              <span className="font-medium">Local Storage:</span>
              <div className="text-muted-foreground mt-1">
                {typeof Storage !== 'undefined' ? 'Destekleniyor' : 'Desteklenmiyor'}
              </div>
            </div>
            <div>
              <span className="font-medium">Console API:</span>
              <div className="text-muted-foreground mt-1">
                {typeof console !== 'undefined' ? 'Mevcut' : 'Mevcut Değil'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}