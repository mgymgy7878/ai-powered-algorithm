import React from 'react'

const Test: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🧪 Test Sayfası</h1>
      <p className="mt-4 text-muted-foreground">
        Bu sayfa test amaçlı oluşturulmuştur. Yeni özellikler burada test edilebilir.
      </p>
      
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Bileşenleri</h2>
        <div className="space-y-2">
          <div className="p-2 bg-background rounded border">
            <p className="text-sm">✅ Sidebar navigasyonu çalışıyor</p>
          </div>
          <div className="p-2 bg-background rounded border">
            <p className="text-sm">✅ React component render ediliyor</p>
          </div>
          <div className="p-2 bg-background rounded border">
            <p className="text-sm">✅ Tailwind CSS stilleri aktif</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Test