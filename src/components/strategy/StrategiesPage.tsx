import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scr
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { TradingStrategy } from '..
import { StrategyEditor } from './StrategyEditor'
  TrendingUp, TrendingDown, Activity, Zap, Bot, Setting
import { toast } from 'sonner'
import { TradingStrategy } from '../../types/trading'
import { 
  const [showEditor, setShowEditor] = useState(fal
  TrendingUp, TrendingDown, Activity, Zap, Bot, Settings
  const [filterStatus, setFilt

    const matchesSearch = strategy
  const [strategies, setStrategies] = useKV<TradingStrategy[]>('trading-strategies', [])
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
  }
                         (filterStatus === 'active' && strategy.status === 'active') ||
                         (filterStatus === 'inactive' && strategy.status !== 'active')
    
    return matchesSearch && matchesFilter
  })

  const handleCreateNew = () => {
      createdAt: new Date().t
    setShowGenerator(true)
   

  const handleEditStrategy = (strategy: TradingStrategy) => {
    setSelectedStrategy(strategy)
        return <Badge c
  }

  const handleDeleteStrategy = (strategyId: string) => {
        return <Badge variant="outline">İnaktif</Badge>
    toast.success('Strateji silindi')
  }

  const handleDuplicateStrategy = (strategy: TradingStrategy) => {
    const newStrategy: TradingStrategy = {

      id: Date.now().toString(),
      {/* Header */}
      createdAt: new Date().toISOString()
    }
    setStrategies(current => [...current, newStrategy])
          </p>
  }

  const getStrategyStatusBadge = (strategy: TradingStrategy) => {
      </div>
      case 'active':
        return <Badge className="bg-green-500 text-white">Aktif</Badge>
      case 'paused':
        return <Badge variant="secondary">Duraklatıldı</Badge>
      case 'error':
        return <Badge variant="destructive">Hata</Badge>
      default:
        return <Badge variant="outline">İnaktif</Badge>
    }
   

  const getPerformanceIcon = (performance?: number) => {
    if (!performance) return <Activity className="h-4 w-4 text-muted-foreground" />
    if (performance > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
   

  return (
    <div className="p-6 space-y-6">
          <CardHeade
      <div className="flex items-center justify-between">
          <Ca
          <h2 className="text-3xl font-bold">Stratejiler</h2>
          <p className="text-muted-foreground">
            Algoritmik trading stratejilerinizi yönetin ve optimize edin
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
              {strategi
        </Button>
        </Ca

            <CardTitle className
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Strateji ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}

        />
        <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <TabsList>
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="active">Aktif</TabsTrigger>
            <TabsTrigger value="inactive">İnaktif</TabsTrigger>
          </TabsList>
               
      </div>

      {/* Strategy Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
                <div className="flex it
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Strateji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategies.length}</div>
          </CardContent>
        </Card>
        <Card>
                    {strategy.descripti
            <CardTitle className="text-sm font-medium text-muted-foreground">Aktif Stratejiler</CardTitle>
              </CardHea
                </div>
          <DialogHeader>
          </DialogHeader>
        </DialogCo

      <Dialog o
          <Dia
          </DialogHeader>
            <StrategyEditor 
              onSave={(
                  curre
                setShowEditor(false)
              }}
          )}
      </Dialog>
  )



















































































































          <DialogHeader>

          </DialogHeader>









          </DialogHeader>

            <StrategyEditor 





                setShowEditor(false)

              }}

          )}

      </Dialog>

  )
