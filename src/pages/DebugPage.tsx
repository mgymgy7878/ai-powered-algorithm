import React from 'react'

const DebugPage: React.FC = () => {
  return (
    <div className="p-6 h-screen bg-red-100">
      <h1 className="text-4xl font-bold text-red-800">🔴 DEBUG SAYFASI</h1>
      <p className="text-lg mt-4">Bu sayfa çalışıyorsa, routing doğru çalışıyor demektir.</p>
      <div className="mt-8 bg-white p-4 rounded border">
        <h2 className="text-xl font-semibold">Test Bilgileri:</h2>
        <ul className="mt-2 space-y-1">
          <li>✅ Sayfa render edildi</li>
          <li>✅ React Router çalışıyor</li>
          <li>✅ Sidebar navigation aktif</li>
          <li>⏰ Zaman: {new Date().toLocaleString('tr-TR')}</li>
        </ul>
      </div>
    </div>
  )
}

export default DebugPage