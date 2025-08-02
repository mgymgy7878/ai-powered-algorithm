import React from 'react'

export default function TestPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-4">Test Sayfası</h1>
      <p className="text-muted-foreground">Bu bir test sayfasıdır. Sidebar navigasyonu çalışıyor.</p>
      
      <div className="mt-6 p-4 bg-card rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Sayfa Başarıyla Yüklendi</h2>
        <p className="text-sm text-muted-foreground">
          Bu sayfa sidebar'dan erişilebilir ve loading takılması problemi çözülmüştür.
        </p>
      </div>
    </div>
  )
}