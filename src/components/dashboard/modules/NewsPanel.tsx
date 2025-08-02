import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Newspaper, ExternalLink, Clock } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  source: string
  url: string
  timestamp: Date
  impact: 'high' | 'medium' | 'low'
  category: 'crypto' | 'defi' | 'regulation' | 'market'
}

export function NewsPanel() {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Bitcoin ETF onayları piyasada büyük heyecan yarattı',
      source: 'CoinDesk',
      url: '#',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      impact: 'high',
      category: 'crypto'
    },
    {
      id: '2',
      title: 'Ethereum 2.0 güncellemesi başarıyla tamamlandı',
      source: 'CoinTelegraph',
      url: '#',
      timestamp: new Date(Date.now() - 32 * 60 * 1000),
      impact: 'medium',
      category: 'crypto'
    },
    {
      id: '3',
      title: 'Fed faiz kararı kripto piyasalarını etkileyebilir',
      source: 'Reuters',
      url: '#',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      impact: 'high',
      category: 'market'
    },
    {
      id: '4',
      title: 'DeFi protokollerinde TVL rekor seviyeye ulaştı',
      source: 'DeFi Pulse',
      url: '#',
      timestamp: new Date(Date.now() - 67 * 60 * 1000),
      impact: 'medium',
      category: 'defi'
    },
    {
      id: '5',
      title: 'Yeni kripto düzenlemeleri Avrupa\'da yürürlüğe girdi',
      source: 'Bloomberg',
      url: '#',
      timestamp: new Date(Date.now() - 89 * 60 * 1000),
      impact: 'high',
      category: 'regulation'
    }
  ])

  // Haberleri periyodik olarak güncelle (simülasyon)
  useEffect(() => {
    const interval = setInterval(() => {
      // Zaman zaman yeni haber ekle
      if (Math.random() > 0.7) {
        const newNews: NewsItem = {
          id: Date.now().toString(),
          title: 'Son dakika: Büyük borsada işlem hacmi %50 arttı',
          source: 'Crypto News',
          url: '#',
          timestamp: new Date(),
          impact: 'medium',
          category: 'market'
        }
        
        setNews(prev => [newNews, ...prev.slice(0, 4)]) // En fazla 5 haber tut
      }
    }, 45000)

    return () => clearInterval(interval)
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'border-red-500 bg-red-50'
      case 'medium':
        return 'border-yellow-500 bg-yellow-50'
      default:
        return 'border-blue-500 bg-blue-50'
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge variant="destructive" className="text-[10px] px-1 py-0">YÜKSEK</Badge>
      case 'medium':
        return <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-yellow-100">ORTA</Badge>
      default:
        return <Badge variant="outline" className="text-[10px] px-1 py-0">DÜŞÜK</Badge>
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crypto':
        return 'text-orange-600 bg-orange-100'
      case 'defi':
        return 'text-purple-600 bg-purple-100'
      case 'regulation':
        return 'text-red-600 bg-red-100'
      case 'market':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60))
    if (minutes < 1) return 'Az önce'
    if (minutes < 60) return `${minutes}dk önce`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}sa önce`
    const days = Math.floor(hours / 24)
    return `${days}g önce`
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Newspaper className="h-4 w-4" />
          Canlı Haber Akışı
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {news.map((item) => (
            <div key={item.id} className={`p-2 rounded-lg border ${getImpactColor(item.impact)}`}>
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-medium text-xs leading-tight line-clamp-2 flex-1 pr-2">
                  {item.title}
                </h4>
                <div className="flex-shrink-0">
                  {getImpactBadge(item.impact)}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] px-1 py-0 ${getCategoryColor(item.category)}`}>
                    {item.category.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {item.source}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      {formatTimeAgo(item.timestamp)}
                    </span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </div>
              
              {/* AI Analiz badge'i ekle */}
              <div className="mt-1 pt-1 border-t border-gray-200">
                <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-blue-100 text-blue-800">
                  AI Analiz: Pozitif etki bekleniyor
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}