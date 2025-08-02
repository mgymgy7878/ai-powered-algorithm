import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function TestDisplay() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Sayfa Görünürlük Testi</h1>
        <p className="text-muted-foreground">
          Bu sayfa görünürlük problemini test etmek için oluşturulmuştur.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Sayfa Render Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-700">✅ Başarılı</Badge>
              <p className="text-sm text-green-600">
                Bu sayfa başarıyla render edildi ve görünür durumda.
              </p>
              <p className="text-xs text-muted-foreground">
                Zaman: {new Date().toLocaleString('tr-TR')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <AlertTriangle className="w-5 h-5" />
              Navigasyon Testi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-700">ℹ️ Bilgi</Badge>
              <p className="text-sm text-blue-600">
                Sidebar navigasyonundan buraya ulaştıysanız, sistem çalışıyor.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sayfa Test Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">OK</div>
                <p className="text-xs text-muted-foreground">Sayfa Durumu</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">ACTIVE</div>
                <p className="text-xs text-muted-foreground">Render Durumu</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <p className="text-xs text-muted-foreground">Görünürlük</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}