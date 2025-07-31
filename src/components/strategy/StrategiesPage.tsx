import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/inpu
import { Button } from '@/components/ui/butto
import { Dialog, DialogContent, DialogHeader, DialogTitl
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
  Pause, 
import { StrategyEditor } from './StrategyEditor'
  Trash,
  Plus, 
  Trendi
  Pause, 
  Sett
  Copy, 

  MoreHorizontal,
  const [sele
  TrendingDown, 
  const [fi
  Zap,
  Settings
} from '@phosphor-icons/react'
import { toast } from 'sonner'

export function StrategiesPage() {
  const [strategies, setStrategies] = useKV<TradingStrategy[]>('trading-strategies', [])
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

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
    
    toast.success('Strateji kopy

  const handleDeleteStrategy = (strategyId: string) => {
    toast.succe

  const getStrategyStatus
      case 'live':
      case 'testing':
      case 'ready':
      case 'draft':
     
    

  const getPerformanceI
   

  // İstatistikler
  const readyStrategiesCount = strategies.filter(s => s.statu
    .filter(s => s.performance?.t

   

          <h2 classN
            Algoritmik trading stratejilerinizi yönetin ve op
        </div>
          <Plus className="h-
        </Button>

      <div className="flex flex-col sm
          pl
          onChange={(e) => setSearchTerm(e.target.value)}
     
    
            <TabsTrigger
          </TabsList>
      </div>
   

            <CardTitl
          <CardContent>
          </CardContent>
        
          <CardHeader className=
          </CardHeader>
            <div class
        </Card>
        <Card>
     
    
          </CardContent>
        
   

            <div 
            </div>
        </Card>

   

        <CardContent>
            {filteredStrategies.length === 0 ? (
                <Bot className
                <p
                </p>
                  <Pl
                </Button>
            ) : (
                {filteredStrategies.map((strategy) => (
                   
                        <div className="flex items-cen
              
                              <h4 className="font-semibold">
     
   

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
          <h2 className="text-3xl font-bold">Stratejiler</h2>
          <p className="text-muted-foreground">
            Algoritmik trading stratejilerinizi yönetin ve optimize edin
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Yeni Strateji Oluştur
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Strateji ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-sm"
        />
        <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <TabsList>
            <TabsTrigger value="all">Tümü ({strategies.length})</TabsTrigger>
            <TabsTrigger value="active">Aktif ({activeStrategiesCount})</TabsTrigger>
            <TabsTrigger value="inactive">İnaktif ({strategies.length - activeStrategiesCount})</TabsTrigger>
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
            <div className="text-2xl font-bold text-green-600">{activeStrategiesCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hazır Stratejiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{readyStrategiesCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Performans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPerformance > 0 ? '+' : ''}{totalPerformance.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategies List */}
      <Card>
        <CardHeader>
          <CardTitle>Strateji Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {filteredStrategies.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Henüz strateji yok</h3>
                <p className="text-muted-foreground mb-4">
                  İlk trading stratejinizi oluşturmak için AI asistanından yardım alın
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Stratejiyi Oluştur
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStrategies.map((strategy) => (
                  <Card key={strategy.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getPerformanceIcon(strategy.performance)}
                            <div>
                              <h4 className="font-semibold">{strategy.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {strategy.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStrategyStatusBadge(strategy)}
                          {strategy.performance && (

                              {strategy.performance.totalReturn > 0 ? '+' : ''}


                          )}

                            {strategy.category}

                          

                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditStrategy(strategy)}>

                                Düzenle

                              <DropdownMenuItem onClick={() => handleDuplicateStrategy(strategy)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Kopyala
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />

                                onClick={() => handleDeleteStrategy(strategy.id)}
                                className="text-red-600"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                    </CardContent>
                  </Card>
                ))}

            )}

        </CardContent>


      {/* Strategy Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <DialogHeader className="sr-only">

          </DialogHeader>

            <StrategyEditor 
              strategy={selectedStrategy}
              onSave={handleSaveStrategy}
              onClose={() => {
                setShowEditor(false)
                setSelectedStrategy(null)
              }}
            />
          )}

      </Dialog>

  )
