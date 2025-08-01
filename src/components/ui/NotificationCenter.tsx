import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Bell, X, TrendingUp, TrendingDown, Bot, AlertTriangle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  timestamp: Date | string // KV storage'dan gelen değer string olabilir
  read: boolean
}

interface NotificationCenterProps {
  className?: string
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Son okunmamış bildirimi al
  const lastNotification = notifications.find(n => !n.read)
  const unreadCount = notifications.filter(n => !n.read).length

  // Bildirim ikonunu belirle
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <Bot className="w-4 h-4 text-blue-500" />
    }
  }

  // Zaman formatla
  const formatTime = (date: Date | string) => {
    const now = new Date()
    // KV storage'dan gelen tarihi Date objesine çevir
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Geçerli bir tarih olup olmadığını kontrol et
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Bilinmeyen zaman'
    }
    
    const diff = now.getTime() - dateObj.getTime()
    
    if (diff < 60000) return 'Az önce'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} dk önce`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} sa önce`
    return `${Math.floor(diff / 86400000)} gün önce`
  }

  // Bildirimi okundu olarak işaretle
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  // Bildirimi sil
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Son bildirimi kapat
  const dismissLastNotification = () => {
    if (lastNotification) {
      markAsRead(lastNotification.id)
    }
  }

  // Yeni bildirim ekle (dışarıdan çağrılabilir)
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  // Global event listener için
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent) => {
      addNotification(event.detail)
    }

    window.addEventListener('new-notification', handleNewNotification as EventListener)
    
    return () => {
      window.removeEventListener('new-notification', handleNewNotification as EventListener)
    }
  }, [])

  // Son bildirimi göster (varsa)
  if (lastNotification) {
    return (
      <div className={`${className}`}>
        <Card className="p-3 bg-background border shadow-md max-w-[360px]">
          <div className="flex items-start gap-3">
            {getNotificationIcon(lastNotification.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {lastNotification.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {lastNotification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTime(lastNotification.timestamp)}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 shrink-0"
              onClick={dismissLastNotification}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Bildirim butonu ve dropdown menü
  return (
    <div className={className}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                variant="destructive"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-80" align="end">
          <div className="flex items-center justify-between p-2">
            <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={markAllAsRead}
              >
                Tümünü okundu işaretle
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Henüz bildirim yok
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </DropdownMenuItem>
              ))
            )}
          </div>
          
          {notifications.length > 10 && (
            <div className="p-2 text-center">
              <Button variant="ghost" size="sm" className="text-xs">
                Tüm bildirimleri görüntüle
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Bildirim ekleme utility fonksiyonu
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  const event = new CustomEvent('new-notification', { detail: notification })
  window.dispatchEvent(event)
}