import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, Trash2, X } from 'lucide-react'
import { useKV } from '@github/spark/hooks'
import { Notification } from '@/types/notification'
import { toast } from 'sonner'

// Global notification handler
let globalNotificationHandler: ((notification: Omit<Notification, 'id'>) => void) | null = null

export function addNotification(notification: Omit<Notification, 'id'>) {
  if (globalNotificationHandler) {
    globalNotificationHandler(notification)
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useKV<Notification[]>('app-notifications', [])
  const [lastNotification, setLastNotification] = useState<Notification | null>(
    notifications.length > 0 ? notifications[0] : null
  )
  const [showLastNotificationBox, setShowLastNotificationBox] = useState(true)

  // Global handler'ı kaydet
  useEffect(() => {
    globalNotificationHandler = handleAddNotification
    return () => {
      globalNotificationHandler = null
    }
  }, [])

  // Yeni bildirim ekle
  const handleAddNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    
    setNotifications(prev => [newNotification, ...prev])
    setLastNotification(newNotification)
    setShowLastNotificationBox(true)
    
    // Toast bildirimi göster
    toast(notification.message, {
      description: newNotification.time,
      icon: <Bell className="w-4 h-4" />
    })
  }

  // Bildirimi sil
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Tüm bildirimleri temizle
  const clearAllNotifications = () => {
    setNotifications([])
    setLastNotification(null)
    setShowLastNotificationBox(false)
  }

  // Son bildirimi gizle
  const hideLastNotification = () => {
    setShowLastNotificationBox(false)
  }

  // Otomatik test bildirimleri (demo amaçlı - kapatıldı)
  useEffect(() => {
    // Test bildirimlerini görmek isterseniz yorumu kaldırın
    /*
    const interval = setInterval(() => {
      const demoNotifications = [
        { message: 'Grid Bot stratejisi başlatıldı', type: 'success' as const },
        { message: 'BTCUSDT alım sinyali', type: 'info' as const },
        { message: 'Stop loss tetiklendi', type: 'warning' as const },
        { message: 'API bağlantı hatası', type: 'error' as const }
      ]
      
      const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)]
      handleAddNotification(randomNotification)
    }, 30000) // 30 saniyede bir test bildirimi

    return () => clearInterval(interval)
    */
  }, [])

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return '📢'
    }
  }

  const getNotificationColor = (type?: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-200'
      case 'warning': return 'bg-yellow-100 border-yellow-200'
      case 'error': return 'bg-red-100 border-red-200'
      default: return 'bg-blue-100 border-blue-200'
    }
  }

  return (
    <div className="relative">
      {/* Son Bildirim Kutusu */}
      {lastNotification && showLastNotificationBox && (
        <Card className={`w-[320px] mb-2 ${getNotificationColor(lastNotification.type)} border shadow-sm`}>
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-lg">{getNotificationIcon(lastNotification.type)}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{lastNotification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{lastNotification.time || 'Şimdi'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={hideLastNotification}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bildirim Dropdown Menüsü */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {notifications.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-80" align="end">
          <div className="flex items-center justify-between px-3 py-2">
            <DropdownMenuLabel className="p-0">Bildirimler</DropdownMenuLabel>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6"
                onClick={clearAllNotifications}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Tümünü Sil
              </Button>
            )}
          </div>
          
          <DropdownMenuSeparator />
          
          {notifications.length === 0 ? (
            <div className="px-3 py-4 text-center text-muted-foreground text-sm">
              Henüz bildirim yok
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.slice(0, 10).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-2 p-3 cursor-pointer"
                  onClick={() => removeNotification(notification.id)}
                >
                  <span className="text-base">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time || 'Şimdi'}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}