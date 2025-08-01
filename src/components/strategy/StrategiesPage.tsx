import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus,
  Play,
  Copy, 
  Trash,
  MoreHorizontal,
  TrendingUp,
  TrendingDown, 
  Activity,
  Bot,
  Settings,
  Zap,
  Pause
} from 'lucide-react'
import { toast } from 'sonner'
import { StrategyEditor } from './StrategyEditor'
import { TradingStrategy } from '../../types/trading'
import { useActivity } from '../../contexts/ActivityContext'

export function StrategiesPage() {
  const [strategies, setStrategies] = useKV<TradingStrategy[]>('trading-strategies', [])
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const { addActivity } = useActivity()

  // Strateji filtreleme
  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && (strategy.status === 'live' || strategy.status === 'testing')) ||
                         (filterStatus === 'inactive' && strategy.status !== 'live' && strategy.status !== 'testing')
    
    return matchesSearch && matchesFilter
  })

  // Yeni strateji oluştur
  const handleCreateNew = () => {
    setSelectedStrategy(null)
    setShowEditor(true)
  }

  // Strateji düzenle
  const handleEditStrategy = (strategy: TradingStrategy) => {
    setSelectedStrategy(strategy)
    setShowEditor(true)
  }

  // Strateji kopyala
  const handleDuplicateStrategy = (strategy: TradingStrategy) => {
    const duplicatedStrategy: TradingStrategy = {
      ...strategy,
      id: Date.now().toString(),
      name: `${strategy.name} (Kopya)`,
      status: 'draft',
      updatedAt: new Date().toISOString()
    }
    setStrategies(prev => [...prev, duplicatedStrategy])
    toast.success('Strateji kopyalandı')
    addActivity(`${strategy.name} stratejisi kopyalandı`, 'info')
  }

  // Strateji sil
  const handleDeleteStrategy = (strategyId: string) => {
    const strategy = strategies.find(s => s.id === strategyId)
    setStrategies(prev => prev.filter(s => s.id !== strategyId))
    toast.success('Strateji silindi')
    addActivity(`${strategy?.name || 'Strateji'} silindi`, 'warning')
  }

  // Strateji kaydet
  const handleSaveStrategy = (strategy: TradingStrategy) => {
    if (selectedStrategy) {
      // Mevcut stratejiyi güncelle
      setStrategies(prev => prev.map(s => s.id === strategy.id ? strategy : s))
      toast.success('Strateji güncellendi')
      addActivity(`${strategy.name} stratejisi güncellendi`, 'info')
    } else {
      // Yeni strateji ekle
      setStrategies(prev => [...prev, strategy])
      toast.success('Strateji oluşturuldu')
      addActivity(`${strategy.name} yeni stratejisi oluşturuldu`, 'success')
    }
    setShowEditor(false)
    setSelectedStrategy(null)
  }

  // Strateji durum rozetini al
  const getStrategyStatusBadge = (strategy: TradingStrategy) => {
    switch (strategy.status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800">Canlı</Badge>
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800">Test</Badge>
      case 'ready':
        return <Badge className="bg-yellow-100 text-yellow-800">Hazır</Badge>
      case 'draft':
        return <Badge variant="secondary">Taslak</Badge>
      default:
        return <Badge variant="secondary">Bilinmeyen</Badge>
    }
  }

  // Performans ikonu al
  const getPerformanceIcon = (performance?: { totalReturn: number }) => {
    if (!performance) return <Activity className="h-4 w-4 text-muted-foreground" />
    if (performance.totalReturn > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  // İstatistikler
  const activeStrategiesCount = strategies.filter(s => s.status === 'live' || s.status === 'testing').length
  const readyStrategiesCount = strategies.filter(s => s.status === 'ready').length
  const totalPerformance = strategies
    .filter(s => s.performance?.totalReturn)
    .reduce((sum, s) => sum + (s.performance?.totalReturn || 0), 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stratejiler</h1>
          <p className="text-muted-foreground">
            Algoritmik trading stratejilerinizi yönetin
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Yeni Strateji
        </Button>
      </div>

      {/* İstatistik Kartları */}
      <div className="flex flex-wrap gap-2 items-center">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Strateji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategies.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktif Stratejiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStrategiesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hazır Stratejiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{readyStrategiesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Performans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPerformance.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ana İçerik */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Input
              placeholder="Strateji ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
              <TabsList>
                <TabsTrigger value="all">Tümü</TabsTrigger>
                <TabsTrigger value="active">Aktif</TabsTrigger>
                <TabsTrigger value="inactive">Pasif</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[400px]">
            {filteredStrategies.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Strateji bulunamadı</h3>
                <p className="text-muted-foreground mb-4">
                  Henüz hiç strateji oluşturmadınız veya arama kriterlerinize uygun strateji yok.
                </p>
                <Button onClick={handleCreateNew} className="gap-2">
                  <Plus className="h-4 w-4" />
                  İlk Stratejiyi Oluştur
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStrategies.map((strategy) => (
                  <Card key={strategy.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{strategy.name}</h3>
                            {getStrategyStatusBadge(strategy)}
                            {getPerformanceIcon(strategy.performance)}
                          </div>
                          {strategy.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {strategy.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Son güncelleme: {new Date(strategy.updatedAt).toLocaleDateString('tr-TR')}</span>
                            {strategy.performance && (
                              <span className={strategy.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                                %{strategy.performance.totalReturn.toFixed(2)} getiri
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {strategy.status === 'ready' && (
                            <Button size="sm" variant="outline" className="gap-2">
                              <Play className="h-4 w-4" />
                              Başlat
                            </Button>
                          )}
                          {(strategy.status === 'live' || strategy.status === 'testing') && (
                            <Button size="sm" variant="outline" className="gap-2">
                              <Pause className="h-4 w-4" />
                              Durdur
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditStrategy(strategy)}>
                                <Settings className="h-4 w-4 mr-2" />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateStrategy(strategy)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Kopyala
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteStrategy(strategy.id)}
                                className="text-red-600"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Strategy Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Strateji Editörü</DialogTitle>
          </DialogHeader>
          <StrategyEditor 
            strategy={selectedStrategy}
            onSave={handleSaveStrategy}
            onClose={() => {
              setShowEditor(false)
              setSelectedStrategy(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}