import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface PortfolioAllocation {
  name: string
  value: number
  percentage: number
  color: string
  category: 'stable' | 'major' | 'altcoin'
}

export function PortfolioAllocationPanel() {
  const [allocations, setAllocations] = useState<PortfolioAllocation[]>([
    {
      name: 'USDT',
      value: 15000,
      percentage: 30,
      color: '#22c55e',
      category: 'stable'
    },
    {
      name: 'BTC',
      value: 20000,
      percentage: 40,
      color: '#f59e0b',
      category: 'major'
    },
    {
      name: 'ETH',
      value: 7500,
      percentage: 15,
      color: '#6366f1',
      category: 'major'
    },
    {
      name: 'BNB',
      value: 3750,
      percentage: 7.5,
      color: '#f59e0b',
      category: 'altcoin'
    },
    {
      name: 'ADA',
      value: 2500,
      percentage: 5,
      color: '#8b5cf6',
      category: 'altcoin'
    },
    {
      name: 'Others',
      value: 1250,
      percentage: 2.5,
      color: '#6b7280',
      category: 'altcoin'
    }
  ])

  const [totalValue, setTotalValue] = useState(50000)

  // Portföy değerlerini periyodik olarak güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      setAllocations(prev => {
        const updated = prev.map(allocation => {
          // Kripto volatilitesini simüle et
          const volatility = allocation.category === 'stable' ? 0.001 : 0.02
          const change = (Math.random() - 0.5) * volatility
          const newValue = allocation.value * (1 + change)
          
          return {
            ...allocation,
            value: newValue
          }
        })
        
        // Yüzdeleri yeniden hesapla
        const newTotal = updated.reduce((sum, item) => sum + item.value, 0)
        setTotalValue(newTotal)
        
        return updated.map(item => ({
          ...item,
          percentage: (item.value / newTotal) * 100
        }))
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toFixed(0)}`
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-2 shadow-md">
          <p className="text-xs font-semibold">{data.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatValue(data.value)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-1 justify-center mt-2">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[10px] text-muted-foreground">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Kategorilere göre gruplama
  const categoryTotals = allocations.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.value
    return acc
  }, {} as Record<string, number>)

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'stable':
        return 'Stabil Coin'
      case 'major':
        return 'Ana Kripto'
      case 'altcoin':
        return 'Altcoin'
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stable':
        return 'text-green-600'
      case 'major':
        return 'text-blue-600'
      case 'altcoin':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <PieChart className="h-4 w-4" />
          Portföy Dağılımı
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-center mb-3">
          <p className="text-lg font-bold text-primary">
            {formatValue(totalValue)}
          </p>
          <p className="text-xs text-muted-foreground">Toplam Portföy Değeri</p>
        </div>

        {/* Pie Chart */}
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocations}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {allocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Kategori özetleri */}
        <div className="grid grid-cols-3 gap-1 mt-3">
          {Object.entries(categoryTotals).map(([category, value]) => (
            <div key={category} className="text-center p-2 bg-muted/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground">
                {getCategoryLabel(category)}
              </p>
              <p className={`text-xs font-semibold ${getCategoryColor(category)}`}>
                {formatValue(value)}
              </p>
              <p className="text-[9px] text-muted-foreground">
                %{((value / totalValue) * 100).toFixed(1)}
              </p>
            </div>
          ))}
        </div>

        {/* En büyük 3 holding */}
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground mb-1">En Büyük Holdingleri:</p>
          {allocations
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{formatValue(item.value)}</span>
                  <span className="text-muted-foreground ml-1">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}