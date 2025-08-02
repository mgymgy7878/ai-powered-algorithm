import React from 'react'

const APage: React.FC = () => {
  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">A Sayfası</h1>
        <p className="text-muted-foreground mt-2">
          Bu basit test sayfası "A" adıyla oluşturulmuştur.
        </p>
      </div>
      
      <div className="flex-1 bg-card rounded-lg border p-6">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-primary">A</div>
          <h2 className="text-xl font-semibold">Test Sayfası Çalışıyor!</h2>
          <p className="text-muted-foreground">
            Bu sayfa sidebar navigasyonu test etmek için oluşturulmuştur.
          </p>
          
          <div className="mt-8 space-y-2">
            <div className="bg-muted rounded-md p-3">
              <strong>Sayfa ID:</strong> a-page
            </div>
            <div className="bg-muted rounded-md p-3">
              <strong>Oluşturulma Zamanı:</strong> {new Date().toLocaleString('tr-TR')}
            </div>
            <div className="bg-muted rounded-md p-3">
              <strong>Durum:</strong> Aktif ✅
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default APage