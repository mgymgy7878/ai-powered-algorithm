import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/inpu
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from
import { 
  Play,
  Copy, 
  MoreHorizontal,
  TrendingDown, 
  Bot,
  Zap
import 
import { 
export f
  const 
  MoreHorizontal,
  TrendingUp,
  TrendingDown, 
  Activity,
  Bot,
  Settings,
  Zap
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { StrategyEditor } from './StrategyEditor'
import { TradingStrategy } from '../../types/trading'

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
    setSelectedStrategy(null)
    setStrategies(prev 
  }

  // Strateji düzenle
  const handleEditStrategy = (strategy: TradingStrategy) => {
    setSelectedStrategy(strategy)
      toast.success('St
  }

  // Strateji kopyala
    setShowEditor(false)
    const duplicatedStrategy: TradingStrategy = {

      id: Date.now().toString(),
    switch (strategy.status) {
      status: 'draft',
      case 'testing':
      updatedAt: new Date().toISOString()
    }
    setStrategies(prev => [...prev, duplicatedStrategy])
    toast.success('Strateji kopyalandı')
  }

  // Strateji sil
  const getPerformanceIcon = (performance?: { totalRetur
    setStrategies(prev => prev.filter(s => s.id !== strategyId))
    return <TrendingDown className="h
  }

  // Strateji kaydet
  const handleSaveStrategy = (strategy: TradingStrategy) => {
    if (selectedStrategy) {

      setStrategies(prev => prev.map(s => s.id === strategy.id ? strategy : s))
      {/* Header */}
    } else {
      // Yeni ekle
      setStrategies(prev => [...prev, strategy])
      toast.success('Strateji oluşturuldu')
    }
    setShowEditor(false)
    setSelectedStrategy(null)
  }

  // Strateji durum rozetini al
  const getStrategyStatusBadge = (strategy: TradingStrategy) => {
          value={searchTerm}
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
   

          </CardContent>
  const getPerformanceIcon = (performance?: { totalReturn: number }) => {
    if (!performance) return <Activity className="h-4 w-4 text-muted-foreground" />
    if (performance.totalReturn > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  // İstatistikler
  const activeStrategiesCount = strategies.filter(s => s.status === 'live' || s.status === 'testing').length
  const readyStrategiesCount = strategies.filter(s => s.status === 'ready').length
          </CardHeader>
    .filter(s => s.performance?.totalReturn)
    .reduce((sum, s) => sum + (s.performance?.totalReturn || 0), 0)

        <C
    <div className="p-6 space-y-6">
          </CardHead
      <div className="flex items-center justify-between">
             
                                <Copy className="h-4 w-4 mr-2
                              </DropdownMenuIte
                              <DropdownMenuItem 
              
              
                              </DropdownMenuItem>
                          </DropdownMe
                      </div>
                 
            

      </Card>
      {/* Strategy Editor Dialog */}
        <Dialo
            <DialogTitle>Strateji Editö
          <StrategyEditor 
            onSave={handleSaveStrategy}
              setShowEditor(false
          
        </DialogContent>
    </div>
}









































































































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