import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { AlertTriangle, Shield, TrendingDown } from 'lucide-react'

interface RiskAlert {
  id: string
  type: 'margin' | 'strategy' | 'market' | 'portfolio'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  value?: string
  timestamp: Date
}

export function RiskAlertsPanel() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([
    {
      id: '1',
      type: 'margin',
      title: 'Yüksek Marj Kullanımı',
      description: 'ETH pozisyonu %85 marjin kullanımında',
      severity: 'high',
      value: '85%',
      timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 dakika önce
    },
    {
      id: '2',
      type: 'strategy',
      title: 'Strateji Performansı',
      description: 'Grid Bot X son 4 işlemde zarar etti',
      severity: 'medium',
      value: '-2.4%',
      timestamp: new Date(Date.now() - 12 * 60 * 1000) // 12 dakika önce
    },
    {
      id: '3',
      type: 'market',
      title: 'Volatilite Uyarısı',
      description: 'BTC volatilitesi %30 arttı, risk yönetimi önerilir',
      severity: 'medium',
      value: '+30%',
      timestamp: new Date(Date.now() - 8 * 60 * 1000) // 8 dakika önce
    },
    {
      id: '4',
      type: 'portfolio',
      title: 'Portföy Dağılımı',
      description: 'Tek varlık portföy ağırlığının %60\'ını oluşturuyor',
      severity: 'low',
      value: '60%',
      timestamp: new Date(Date.now() - 20 * 60 * 1000) // 20 dakika önce
    }
  ])

  // Risk uyarılarını periyodik olarak güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      // Zaman zaman yeni risk uyarıları ekle
      if (Math.random() > 0.8) {
        const newAlert: RiskAlert = {
          id: Date.now().toString(),
          type: 'market',
          title: 'Piyasa Hareketi',
          description: 'Ani fiyat değişimi tespit edildi',
          severity: 'medium',
          timestamp: new Date()
        }
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]) // En fazla 5 uyarı tut
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-3 w-3 text-red-600" />
      case 'high':
        return <AlertTriangle className="h-3 w-3 text-red-500" />
      case 'medium':
        return <Shield className="h-3 w-3 text-yellow-600" />
      default:
        return <TrendingDown className="h-3 w-3 text-blue-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-600 bg-red-50'
      case 'high':
        return 'border-red-500 bg-red-50'
      case 'medium':
        return 'border-yellow-500 bg-yellow-50'
      default:
        return 'border-blue-500 bg-blue-50'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="text-[10px] px-1 py-0">KRİTİK</Badge>
      case 'high':
        return <Badge variant="destructive" className="text-[10px] px-1 py-0">YÜKSEK</Badge>
      case 'medium':
        return <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-yellow-100">ORTA</Badge>
      default:
        return <Badge variant="outline" className="text-[10px] px-1 py-0">DÜŞÜK</Badge>
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60))
    if (minutes < 1) return 'Az önce'
    if (minutes < 60) return `${minutes}dk önce`
    const hours = Math.floor(minutes / 60)
    return `${hours}sa önce`
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4" />
          Risk Uyarı Kartları
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(alert.severity)}
                  <span className="font-medium text-xs">{alert.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  {alert.value && (
                    <span className="text-xs font-semibold">{alert.value}</span>
                  )}
                  {getSeverityBadge(alert.severity)}
                </div>
              </div>
              
              <p className="text-[11px] text-muted-foreground mb-1">
                {alert.description}
              </p>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-[10px] px-1 py-0">
                  {alert.type.toUpperCase()}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {formatTimeAgo(alert.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}