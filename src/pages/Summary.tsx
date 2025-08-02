import React from 'react'

const Summary: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📊 Özet</h1>
      <p className="mt-4 text-muted-foreground">
        Platform performansı ve genel durumun özeti.
      </p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-card border rounded-lg">
          <h3 className="font-semibold text-lg">Toplam Stratejiler</h3>
          <p className="text-2xl font-bold text-primary mt-2">0</p>
          <p className="text-xs text-muted-foreground">Kayıtlı strateji sayısı</p>
        </div>
        
        <div className="p-4 bg-card border rounded-lg">
          <h3 className="font-semibold text-lg">Aktif İşlemler</h3> 
          <p className="text-2xl font-bold text-accent mt-2">0</p>
          <p className="text-xs text-muted-foreground">Şu anda çalışan</p>
        </div>
        
        <div className="p-4 bg-card border rounded-lg">
          <h3 className="font-semibold text-lg">Sistem Durumu</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">✅ Aktif</p>
          <p className="text-xs text-muted-foreground">AI motor çalışıyor</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Son Aktiviteler</h2>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Henüz aktivite bulunmamaktadır.</p>
        </div>
      </div>
    </div>
  )
}

export default Summary