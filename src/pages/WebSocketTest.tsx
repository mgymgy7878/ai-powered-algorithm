import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WebSocketTester } from '@/components/testing/WebSocketTester'
import { RealTimeMonitor } from '@/components/monitoring/RealTimeMonitor'

export default function WebSocketTestPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">WebSocket & Ağ Performansı Test Merkezi</h1>
          <p className="text-muted-foreground">
            Gerçek zamanlı veri akışını test edin ve sistem performansını izleyin
          </p>
        </div>
        
        <Tabs defaultValue="tester" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tester">WebSocket Tester</TabsTrigger>
            <TabsTrigger value="monitor">Performans İzleme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tester" className="space-y-0">
            <WebSocketTester />
          </TabsContent>
          
          <TabsContent value="monitor" className="space-y-0">
            <RealTimeMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}