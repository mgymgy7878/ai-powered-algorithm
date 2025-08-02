import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TestTube, CheckCircle, AlertTriangle } from 'lucide-react'

export default function Test() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <TestTube className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">🧪 Test Sayfası</h1>
            <p className="text-muted-foreground">
              Geliştirme ve test amaçlı kullanılan sayfa
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Test Ortamı</Badge>
          <Badge variant="secondary">Geliştirme</Badge>
          <Badge variant="outline">Debug Mode</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Sistem Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>React App</span>
                <Badge variant="default">Çalışıyor</Badge>
              </div>
              <div className="flex justify-between">
                <span>TypeScript</span>
                <Badge variant="default">Aktif</Badge>
              </div>
              <div className="flex justify-between">
                <span>Tailwind CSS</span>
                <Badge variant="default">Yüklü</Badge>
              </div>
              <div className="flex justify-between">
                <span>Shadcn/ui</span>
                <Badge variant="default">Entegre</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Test Notları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>• Bu sayfa test ve debugging amaçlı oluşturulmuştur.</p>
              <p>• Yeni özellikler burada test edilebilir.</p>
              <p>• Production'da kaldırılabilir.</p>
              <p>• Component'ler burada deneme yapılabilir.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Alanı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-mono text-sm">
              console.log("Test sayfası başarıyla yüklendi! 🚀")
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}