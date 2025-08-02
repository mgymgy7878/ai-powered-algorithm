import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { CheckCircle, Clock, AlertCircle, Target, Code, Settings, Zap, TrendingUp, Brain, Database } from 'lucide-react'

interface FeatureItem {
  name: string
  status: 'completed' | 'in-progress' | 'planned' | 'blocked'
  priority: 'high' | 'medium' | 'low'
  description: string
  progress?: number
}

const ProjectAnalysis: React.FC = () => {
  const [lastUpdated] = useState(new Date().toLocaleDateString('tr-TR'))
  
  const currentFeatures: FeatureItem[] = [
    { name: 'Dashboard Arayüzü', status: 'completed', priority: 'high', description: 'Ana sayfa ve genel görünüm' },
    { name: 'Sidebar Navigasyonu', status: 'completed', priority: 'high', description: 'Sol menü sistemi' },
    { name: 'AI Trading Yöneticisi', status: 'completed', priority: 'high', description: 'Yapay zeka destekli asistan' },
    { name: 'Strateji Yönetimi', status: 'completed', priority: 'high', description: 'Strateji oluşturma ve yönetim' },
    { name: 'API Ayarları', status: 'completed', priority: 'high', description: 'OpenAI, Claude, Binance API entegrasyonu' },
    { name: 'Bildirim Sistemi', status: 'completed', priority: 'medium', description: 'Üst panel bildirim gösterimi' },
    { name: 'KV Storage', status: 'completed', priority: 'high', description: 'Veri saklama sistemi' }
  ]
  
  const inProgressFeatures: FeatureItem[] = [
    { name: 'Backtest Motoru', status: 'in-progress', priority: 'high', description: 'Geçmiş veri ile strateji testi', progress: 60 },
    { name: 'Canlı İşlem', status: 'in-progress', priority: 'high', description: 'Gerçek zamanlı trading', progress: 40 },
    { name: 'Binance API Entegrasyonu', status: 'in-progress', priority: 'high', description: 'Binance Futures bağlantısı', progress: 70 },
    { name: 'Grafik Görünümü', status: 'in-progress', priority: 'medium', description: 'TradingView benzeri grafikler', progress: 30 },
    { name: 'Portföy Analizi', status: 'in-progress', priority: 'medium', description: 'Detaylı portföy raporları', progress: 25 }
  ]
  
  const plannedFeatures: FeatureItem[] = [
    { name: 'WebSocket Gerçek Zamanlı Veri', status: 'planned', priority: 'high', description: 'Anlık fiyat ve sipariş defteri verisi' },
    { name: 'Gelişmiş AI Stratejileri', status: 'planned', priority: 'high', description: 'Machine Learning tabanlı stratejiler' },
    { name: 'Risk Yönetimi', status: 'planned', priority: 'high', description: 'Stop-loss, take-profit, pozisyon boyutlandırma' },
    { name: 'Multi-Exchange Desteği', status: 'planned', priority: 'medium', description: 'Birden fazla borsa entegrasyonu' },
    { name: 'Ekonomik Takvim Entegrasyonu', status: 'planned', priority: 'medium', description: 'Makroekonomik olaylar ve etkileri' },
    { name: 'Sosyal Trading', status: 'planned', priority: 'low', description: 'Strateji paylaşımı ve kopyalama' },
    { name: 'Mobil Uygulama', status: 'planned', priority: 'low', description: 'iOS ve Android uygulaması' }
  ]
  
  const technicalDebt: FeatureItem[] = [
    { name: 'Hata İşleme İyileştirmesi', status: 'planned', priority: 'high', description: 'Daha iyi error handling ve logging' },
    { name: 'Performance Optimizasyonu', status: 'planned', priority: 'medium', description: 'Component lazy loading ve memoization' },
    { name: 'Test Coverage', status: 'planned', priority: 'medium', description: 'Unit ve integration testleri' },
    { name: 'Kod Dokümantasyonu', status: 'planned', priority: 'low', description: 'Kapsamlı kod açıklamaları' }
  ]
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />
      case 'planned': return <Target className="w-4 h-4 text-gray-500" />
      case 'blocked': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4" />
    }
  }
  
  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      planned: 'bg-gray-100 text-gray-700',
      blocked: 'bg-red-100 text-red-700'
    }
    const labels = {
      completed: 'Tamamlandı',
      'in-progress': 'Devam Ediyor',
      planned: 'Planlandı',
      blocked: 'Engellendi'
    }
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }
  
  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    }
    const labels = {
      high: 'Yüksek',
      medium: 'Orta',
      low: 'Düşük'
    }
    
    return (
      <Badge className={variants[priority as keyof typeof variants]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    )
  }
  
  const completedCount = currentFeatures.length
  const inProgressCount = inProgressFeatures.length
  const plannedCount = plannedFeatures.length
  const totalCount = completedCount + inProgressCount + plannedCount
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Code className="w-8 h-8 text-primary" />
          AI Trading Platform - Proje Durumu
        </h1>
        <p className="text-muted-foreground mt-2">
          Son güncelleme: {lastUpdated} • Versiyon: v1.0.0-beta
        </p>
      </div>

      {/* Genel İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tamamlanan</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Devam Eden</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planlanan</p>
                <p className="text-2xl font-bold text-gray-600">{plannedCount}</p>
              </div>
              <Target className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tamamlanma</p>
                <p className="text-2xl font-bold text-primary">{completionPercentage}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Genel İlerleme */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Genel Proje İlerlemesi</h3>
          <Progress value={completionPercentage} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {completedCount} / {totalCount} özellik tamamlandı
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Mevcut Özellikler</TabsTrigger>
          <TabsTrigger value="progress">Devam Edenler</TabsTrigger>
          <TabsTrigger value="planned">Planlananlar</TabsTrigger>
          <TabsTrigger value="technical">Teknik Borç</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Tamamlanan Özellikler ({completedCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(feature.status)}
                      <div>
                        <h4 className="font-medium">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(feature.priority)}
                      {getStatusBadge(feature.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Devam Eden Özellikler ({inProgressCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inProgressFeatures.map((feature, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(feature.status)}
                        <div>
                          <h4 className="font-medium">{feature.name}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(feature.priority)}
                        {getStatusBadge(feature.status)}
                      </div>
                    </div>
                    {feature.progress && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">İlerleme</span>
                          <span className="text-sm font-medium">{feature.progress}%</span>
                        </div>
                        <Progress value={feature.progress} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="planned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-500" />
                Planlanan Özellikler ({plannedCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plannedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(feature.status)}
                      <div>
                        <h4 className="font-medium">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(feature.priority)}
                      {getStatusBadge(feature.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
                Teknik Borç ve İyileştirmeler ({technicalDebt.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {technicalDebt.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(item.priority)}
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Teknoloji Stack */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Teknoloji Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Frontend
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• React 18 + TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Shadcn/ui Components</li>
                <li>• Vite Build Tool</li>
                <li>• Lucide Icons</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI & APIs
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• OpenAI GPT-4</li>
                <li>• Anthropic Claude</li>
                <li>• Binance Futures API</li>
                <li>• WebSocket Streams</li>
                <li>• REST API Integrations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Data & Storage
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Spark KV Storage</li>
                <li>• Local State Management</li>
                <li>• Real-time Data Streaming</li>
                <li>• Market Data Caching</li>
                <li>• Strategy Persistence</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sonraki Adımlar */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Öncelikli Sonraki Adımlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-900">1. Backtest Motoru Tamamlama</h4>
              <p className="text-sm text-blue-700 mt-1">
                Geçmiş veri ile strateji testini tamamla, performans metriklerini ekle
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-green-900">2. Binance API Entegrasyonu</h4>
              <p className="text-sm text-green-700 mt-1">
                Canlı veri akışı ve order placement özelliklerini aktifleştir
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-medium text-purple-900">3. Risk Yönetimi</h4>
              <p className="text-sm text-purple-700 mt-1">
                Stop-loss, take-profit ve pozisyon boyutlandırma sistemlerini ekle
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectAnalysis