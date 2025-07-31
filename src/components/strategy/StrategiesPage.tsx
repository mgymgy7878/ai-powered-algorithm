import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { StrategyEditor } from './StrategyEditor'
import { StrategyGenerator } from './StrategyGenerator'
import { toast } from 'sonner'
import { TradingStrategy } from '../../types/trading'
import { 
  Plus, Code, Play, Pause, Copy, Trash, Edit, Eye,
  TrendingUp, TrendingDown, Activity, Zap, Bot, Settings
} from '@phosphor-icons/react'

export function StrategiesPage() {
  const [strategies, setStrategies] = useKV<TradingStrategy[]>('trading-strategies', [])
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && strategy.status === 'active') ||
                         (filterStatus === 'inactive' && strategy.status !== 'active')
    
    return matchesSearch && matchesFilter
  })

  const handleCreateNew = () => {
    setSelectedStrategy(null)
    setShowGenerator(true)
  }

  const handleEditStrategy = (strategy: TradingStrategy) => {
    setSelectedStrategy(strategy)
    setShowEditor(true)
  }

  const handleDeleteStrategy = (strategyId: string) => {
    setStrategies(current => current.filter(s => s.id !== strategyId))
    toast.success('Strateji silindi')
  }

  const handleDuplicateStrategy = (strategy: TradingStrategy) => {
    const newStrategy: TradingStrategy = {
      ...strategy,
      id: Date.now().toString(),
      name: `${strategy.name} (Kopya)`,
      createdAt: new Date().toISOString()
    }
    setStrategies(current => [...current, newStrategy])
    toast.success('Strateji kopyalandı')
  }

  const getStrategyStatusBadge = (strategy: TradingStrategy) => {
    switch (strategy.status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Aktif</Badge>
      case 'paused':
        return <Badge variant="secondary">Duraklatıldı</Badge>
      case 'error':
        return <Badge variant="destructive">Hata</Badge>
      default:
        return <Badge variant="outline">İnaktif</Badge>
    }
  }

  const getPerformanceIcon = (performance?: number) => {
    if (!performance) return <Activity className="h-4 w-4 text-muted-foreground" />
    if (performance > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Stratejiler</h2>
          <p className="text-muted-foreground">
            Algoritmik trading stratejilerinizi yönetin ve optimize edin
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Yeni Strateji
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Strateji ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <TabsList>
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="active">Aktif</TabsTrigger>
            <TabsTrigger value="inactive">İnaktif</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Strategy Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Strateji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aktif Stratejiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {strategies.filter(s => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duraklatılmış</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {strategies.filter(s => s.status === 'paused').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hatalı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {strategies.filter(s => s.status === 'error').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStrategies.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Henüz strateji yok</h3>
              <p className="text-muted-foreground mb-4 text-center">
                İlk algoritmik trading stratejinizi oluşturmak için AI asistanını kullanın
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                İlk Stratejiyi Oluştur
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredStrategies.map((strategy) => (
            <Card key={strategy.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStrategyStatusBadge(strategy)}
                      <Badge variant="outline">{strategy.symbol || 'Multi-Symbol'}</Badge>
                    </div>
                  </div>
                  {getPerformanceIcon(strategy.performance?.totalReturn)}
                </div>
                {strategy.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {strategy.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Performance Metrics */}
                {strategy.performance && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Toplam Getiri</span>
                      <div className={`font-medium ${
                        (strategy.performance.totalReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {((strategy.performance.totalReturn || 0) * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">İşlem Sayısı</span>
                      <div className="font-medium">{strategy.performance.totalTrades || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Kazanma Oranı</span>
                      <div className="font-medium">
                        {((strategy.performance.winRatio || 0) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Drawdown</span>
                      <div className="font-medium text-red-600">
                        {((strategy.performance.maxDrawdown || 0) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditStrategy(strategy)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Düzenle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicateStrategy(strategy)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteStrategy(strategy.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Strategy Generator Dialog */}
      <Dialog open={showGenerator} onOpenChange={setShowGenerator}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yeni Strateji Oluştur</DialogTitle>
          </DialogHeader>
          <StrategyGenerator />
        </DialogContent>
      </Dialog>

      {/* Strategy Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Strateji Düzenle: {selectedStrategy?.name}</DialogTitle>
          </DialogHeader>
          {selectedStrategy && (
            <StrategyEditor 
              strategy={selectedStrategy}
              onSave={(updatedStrategy) => {
                setStrategies(current => 
                  current.map(s => s.id === updatedStrategy.id ? updatedStrategy : s)
                )
                setShowEditor(false)
                toast.success('Strateji güncellendi')
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}