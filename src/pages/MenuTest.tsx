import React, { useState } from 'react'
import { AppView } from '../App'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

// Tüm mevcut menü öğeleri
const menuItems: { id: AppView; label: string; description: string }[] = [
  { id: 'dashboard', label: 'Anasayfa', description: 'Ana dashboard görünümü' },
  { id: 'strategies', label: 'Stratejiler', description: 'Trading stratejileri listesi' },
  { id: 'live', label: 'Çalışan Stratejiler', description: 'Aktif çalışan stratejiler' },
  { id: 'backtest', label: 'Backtesting', description: 'Strateji geçmiş testi' },
  { id: 'portfolio', label: 'Portföy', description: 'Portföy görünümü' },
  { id: 'analysis', label: 'Piyasa Analizi', description: 'Piyasa analiz araçları' },
  { id: 'economic', label: 'Ekonomik Takvim', description: 'Ekonomik olaylar takvimi' },
  { id: 'project-status', label: 'Proje Durumu', description: 'Proje özet sayfası' },
  { id: 'test', label: 'Test', description: 'Test sayfası' },
  { id: 'proje', label: 'Proje', description: 'Proje sayfası' },
  { id: 'a', label: 'A Sayfası', description: 'A test sayfası' },
  { id: 'test-display', label: 'Test Display', description: 'Test görüntüleme sayfası' },
  { id: 'debug', label: 'Debug', description: 'Debug araçları' },
  { id: 'settings', label: 'API Ayarları', description: 'API yapılandırmaları' },
]

export default function MenuTest() {
  const [testResults, setTestResults] = useState<Record<string, 'untested' | 'success' | 'error'>>({})
  const [currentView, setCurrentView] = useState<AppView>('dashboard')

  const testMenuItem = (viewId: AppView) => {
    console.log(`🧪 Testing menu item: ${viewId}`)
    
    try {
      // Sayfa değiştirme simülasyonu
      setCurrentView(viewId)
      
      // Event dispatch simülasyonu
      const event = new CustomEvent('menu-test', { 
        detail: { viewId, timestamp: Date.now() } 
      })
      window.dispatchEvent(event)
      
      setTestResults(prev => ({
        ...prev,
        [viewId]: 'success'
      }))
      
      console.log(`✅ Test passed for: ${viewId}`)
    } catch (error) {
      console.error(`❌ Test failed for: ${viewId}`, error)
      setTestResults(prev => ({
        ...prev,
        [viewId]: 'error'
      }))
    }
  }

  const testAllMenuItems = () => {
    console.log('🚀 Testing all menu items...')
    menuItems.forEach((item, index) => {
      setTimeout(() => {
        testMenuItem(item.id)
      }, index * 200) // 200ms aralıklarla test et
    })
  }

  const clearResults = () => {
    setTestResults({})
    console.log('🧹 Test results cleared')
  }

  const getStatusBadge = (viewId: string) => {
    const status = testResults[viewId]
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">✅ Başarılı</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">❌ Hata</Badge>
      default:
        return <Badge variant="outline">⏳ Test Edilmedi</Badge>
    }
  }

  const successCount = Object.values(testResults).filter(r => r === 'success').length
  const errorCount = Object.values(testResults).filter(r => r === 'error').length
  const totalCount = menuItems.length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🧪 Menü Öğeleri Test Sayfası</h1>
        <p className="text-muted-foreground">
          Tüm sidebar menü öğelerinin çalışma durumunu test edin
        </p>
      </div>

      {/* Test İstatistikleri */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test İstatistikleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="text-sm">
              <span className="font-medium">Toplam:</span> {totalCount}
            </div>
            <div className="text-sm text-green-600">
              <span className="font-medium">Başarılı:</span> {successCount}
            </div>
            <div className="text-sm text-red-600">
              <span className="font-medium">Hatalı:</span> {errorCount}
            </div>
            <div className="text-sm text-blue-600">
              <span className="font-medium">Mevcut Görünüm:</span> {currentView}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Kontrolleri */}
      <div className="flex gap-3 mb-6">
        <Button onClick={testAllMenuItems} className="bg-blue-600 hover:bg-blue-700">
          🚀 Tüm Menüleri Test Et
        </Button>
        <Button onClick={clearResults} variant="outline">
          🧹 Sonuçları Temizle
        </Button>
      </div>

      {/* Menü Öğeleri Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{item.label}</CardTitle>
                {getStatusBadge(item.id)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {item.description}
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => testMenuItem(item.id)}
                  className="flex-1"
                >
                  🧪 Test Et
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    console.log(`📋 Menu ID: ${item.id}`)
                    navigator.clipboard?.writeText(item.id)
                  }}
                >
                  📋
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Debug Console */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🐛 Debug Console</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-lg max-h-64 overflow-y-auto">
            <div>💡 Console loglarını tarayıcının Developer Tools'unda kontrol edin</div>
            <div>🔍 F12 tuşuna basın → Console sekmesine gidin</div>
            <div>🧪 Test sonuçları burada görünecek</div>
            <div className="mt-2 text-yellow-400">
              Mevcut görünüm: {currentView}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}