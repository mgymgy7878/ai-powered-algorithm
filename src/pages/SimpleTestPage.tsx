import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TestTube, CheckCircle, AlertCircle, Clock } from 'lucide-react'

const TestPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <TestTube className="w-8 h-8" />
          Test Sayfası
        </h1>
        <p className="text-muted-foreground">
          Spark platformu test ve doğrulama sayfası
        </p>
      </div>

      {/* Test Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Navigasyon Testi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-700">✅ Başarılı</Badge>
              <p className="text-sm text-green-600">
                Sidebar navigasyonu düzgün çalışıyor. Tüm sayfalar erişilebilir.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Clock className="w-5 h-5" />
              Sayfa Yükleme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-700">🔄 Test Ediliyor</Badge>
              <p className="text-sm text-blue-600">
                Sayfa yükleme hızları ve performans test ediliyor.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="w-5 h-5" />
              UI Bileşenleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-yellow-100 text-yellow-700">⚠️ Geliştiriliyor</Badge>
              <p className="text-sm text-yellow-600">
                Bazı UI bileşenleri optimize ediliyor.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Detayları */}
      <Card>
        <CardHeader>
          <CardTitle>Test Sonuçları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">9/10</div>
                <p className="text-xs text-muted-foreground">Sayfa Navigasyonu</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">8/10</div>
                <p className="text-xs text-muted-foreground">UI Performans</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">7/10</div>
                <p className="text-xs text-muted-foreground">Responsivlik</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <p className="text-xs text-muted-foreground">Genel Skor</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Son Test Zamanı</h4>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Aksiyonları */}
      <div className="flex gap-4">
        <Button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <TestTube className="w-4 h-4" />
          Sayfayı Yenile
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => console.log('Test verisi:', { timestamp: new Date(), page: 'test' })}
        >
          Console Log Test
        </Button>
      </div>
    </div>
  )
}

export default TestPage