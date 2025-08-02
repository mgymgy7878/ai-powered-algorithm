import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Code, 
  Zap, 
  Activity,
  TrendingUp,
  Settings,
  Bot,
  BarChart,
  Copy
} from 'lucide-react'

const ProjectStatusPage: React.FC = () => {
  // Mevcut özellikler
  const currentFeatures = [
    { name: 'Strateji Yönetimi', status: 'active', description: 'Strateji oluşturma, başlatma ve silme işlemleri' },
    { name: 'AI Trading Yöneticisi', status: 'active', description: 'Yapay zeka destekli öneri sistemi ve sohbet arayüzü' },
    { name: 'Dashboard', status: 'active', description: 'Portföy K/Z, başarı oranı ve performans grafikleri' },
    { name: 'Bildirim Sistemi', status: 'active', description: 'Önemli olaylar için bildirim gösterimi' },
    { name: 'Model Seçici', status: 'active', description: 'GPT-4o ve Claude gibi modeller arası geçiş' },
    { name: 'Binance API', status: 'partial', description: 'Gerçek zamanlı veri çekme ve hesap bilgisi alma' },
    { name: 'TradingView Grafik', status: 'active', description: 'Profesyonel grafik gösterimi' }
  ]

  // Geliştirilmesi gerekenler
  const improvements = [
    { priority: 'high', item: 'Tüm API bağlantıları için merkezi yönetim ekranı', category: 'API' },
    { priority: 'high', item: 'AI mesaj kutusunun her sayfada sabit görünmesi', category: 'UI/UX' },
    { priority: 'medium', item: 'Bildirim geçmişi için modal açılır pencere', category: 'UI/UX' },
    { priority: 'medium', item: 'Gelişmiş sinyal geçmişi ve işlem grafikleri', category: 'Analiz' },
    { priority: 'low', item: 'Kullanıcıya özel AI eğitimi (fine-tuning)', category: 'AI' },
    { priority: 'low', item: 'Grid bot, RSI bot gibi preset stratejiler', category: 'Strateji' }
  ]

  // Teknoloji stack
  const techStack = [
    { name: 'React 18', version: '18.x', status: 'current' },
    { name: 'TypeScript', version: '5.x', status: 'current' },
    { name: 'Tailwind CSS', version: '3.x', status: 'current' },
    { name: 'Shadcn/UI', version: '0.8.x', status: 'current' },
    { name: 'Vite', version: '5.x', status: 'current' },
    { name: 'OpenAI API', version: 'v1', status: 'integrated' },
    { name: 'Binance API', version: 'v3', status: 'partial' }
  ]

  const copyProjectPrompt = () => {
    const prompt = `
### 🚀 Geliştirme Talebi: Spark AI Trading Platform

**Mevcut Özellikler:**
- ✅ Strateji Yönetimi (oluşturma, başlatma, silme)
- ✅ AI Trading Yöneticisi (GPT-4o/Claude entegrasyonu)
- ✅ Dashboard (portföy metrikleri, performans)
- ✅ Bildirim Sistemi
- ✅ TradingView Grafik Entegrasyonu
- ⚠️ Binance API (kısmi entegrasyon)

**Geliştirilmesi Gerekenler:**
${improvements.map(item => `- [${item.priority.toUpperCase()}] ${item.item} (${item.category})`).join('\n')}

**Teknoloji Stack:**
React 18 + TypeScript + Tailwind CSS + Shadcn/UI + Vite

**Hedef:**
AI destekli, profesyonel algoritmik trading platformu.
`.trim()

    navigator.clipboard.writeText(prompt)
    // Burada toast bildirimi gösterebilirsiniz
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'partial':
        return 'text-yellow-600 bg-yellow-100'
      case 'inactive':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Activity className="w-8 h-8" />
            Proje Durumu
          </h1>
          <p className="text-muted-foreground mt-1">
            AI Trading Platform gelişim sürecinin özeti ve proje planı
          </p>
        </div>
        <Button onClick={copyProjectPrompt} variant="outline" className="flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Prompt Kopyala
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mevcut Özellikler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Mevcut Özellikler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {currentFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge className={`${getStatusColor(feature.status)} text-xs`}>
                        {feature.status === 'active' ? '✅' : feature.status === 'partial' ? '⚠️' : '❌'}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{feature.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Geliştirilmesi Gerekenler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Geliştirilmesi Gerekenler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge className={`${getPriorityColor(improvement.priority)} text-xs`}>
                        {improvement.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{improvement.item}</p>
                      <p className="text-xs text-muted-foreground mt-1">Kategori: {improvement.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Teknoloji Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            Teknoloji Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="flex flex-col items-center p-4 border rounded-lg text-center">
                <h4 className="font-medium text-sm">{tech.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{tech.version}</p>
                <Badge 
                  className={`mt-2 text-xs ${
                    tech.status === 'current' ? 'bg-green-100 text-green-700' : 
                    tech.status === 'integrated' ? 'bg-blue-100 text-blue-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {tech.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{currentFeatures.filter(f => f.status === 'active').length}</div>
            <p className="text-sm text-muted-foreground">Aktif Özellik</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{improvements.filter(i => i.priority === 'high').length}</div>
            <p className="text-sm text-muted-foreground">Yüksek Öncelik</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{techStack.length}</div>
            <p className="text-sm text-muted-foreground">Teknoloji</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <p className="text-sm text-muted-foreground">Tamamlanma</p>
          </CardContent>
        </Card>
      </div>

      {/* Son Güncelleme */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            <span>Versiyon: 0.8.5-beta</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectStatusPage
