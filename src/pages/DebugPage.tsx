import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  
  useEffect(() => {
    // Mevcut console.log'ları yakala
    const originalLog = console.log
    const logMessages: string[] = []
    
    console.log = (...args) => {
      logMessages.push(args.join(' '))
      setLogs([...logMessages])
      originalLog(...args)
    }
    
    return () => {
      console.log = originalLog
    }
  }, [])
  
  const clearLogs = () => {
    setLogs([])
  }
  
  const testNavigation = () => {
    console.log('🧪 Test Navigation: Current location:', window.location.href)
    console.log('🧪 Test Navigation: Available functions:', Object.keys(window))
  }
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Debug Sayfası</h1>
        <p className="text-muted-foreground">Sistem debug bilgileri ve konsol logları</p>
      </div>
      
      <div className="flex gap-4">
        <Button onClick={clearLogs} variant="outline">
          Logları Temizle
        </Button>
        <Button onClick={testNavigation} variant="outline">
          Navigasyon Test Et
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Konsol Logları ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto bg-black text-green-400 p-4 rounded text-sm font-mono">
            {logs.length === 0 ? (
              <p>Henüz log mesajı yok...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sistem Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>URL:</strong> {window.location.href}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Screen:</strong> {screen.width}x{screen.height}</p>
            <p><strong>Viewport:</strong> {window.innerWidth}x{window.innerHeight}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}