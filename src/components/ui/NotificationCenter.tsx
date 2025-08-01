import React, { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertTriangle, Info, XCircle } from '@phosphor-icons/react'
import { Button } from './button'
import { Card } from './card'
import { Badge } from './badge'

export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  time: string
  isRead?: boolean
}

interface NotificationCenterProps {
  className?: string
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Global notification pusher fonksiyonunu window'a kaydet
  useEffect(() => {
    const pushNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        message,
        type,
        time: new Date().toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isRead: false
      }

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Max 10 bildirim saklayalım
      setUnreadCount(prev => prev + 1)
    }

    // Global fonksiyonu window'a ekle
    ;(window as any).pushNotification = pushNotification

    // Component unmount olduğunda temizle
    return () => {
      delete (window as any).pushNotification
    }
  }, [])

  // Son bildirimi al (en üstteki)
  const latestNotification = notifications[0]

  // Dropdown'u aç/kapat
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
    
    // Açıldığında tüm bildirimleri okundu olarak işaretle
    if (!isDropdownOpen) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    }
  }

  // Bildirim ikonunu type'a göre döndür
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case 'error':
        return <XCircle className="w-3 h-3 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-yellow-500" />
      case 'info':
      default:
        return <Info className="w-3 h-3 text-blue-500" />
    }
  }

  // Bildirim temizleme
  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
    setIsDropdownOpen(false)
  }

  // Tekil bildirim silme
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Dışarı tıklanınca dropdown'u kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.notification-center')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <div className={`relative notification-center ${className}`}>
      {/* Son Bildirim Kutusu (her zaman görünür) */}
      {latestNotification ? (
        <Card
          className="p-2 cursor-pointer hover:bg-muted/50 transition-colors shadow-sm border-l-2 border-l-primary"
          onClick={toggleDropdown}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getNotificationIcon(latestNotification.type)}
              <span className="text-xs truncate flex-1">{latestNotification.message}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs text-muted-foreground">{latestNotification.time}</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs h-4 w-4 p-0 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
              <Bell className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </Card>
      ) : (
        <Card
          className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={toggleDropdown}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Henüz bildirim yok</span>
            <Bell className="w-3 h-3 text-muted-foreground" />
          </div>
        </Card>
      )}

      {/* Geçmiş Bildirimler Dropdown */}
      {isDropdownOpen && (
        <Card className="absolute top-full left-0 mt-1 w-[320px] max-h-[300px] shadow-lg border z-[999] bg-background">
          {/* Başlık */}
          <div className="p-2 border-b flex items-center justify-between bg-muted/50">
            <span className="text-xs font-semibold">Bildirimler</span>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs h-5 px-1"
                >
                  Temizle
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDropdownOpen(false)}
                className="h-5 w-5 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Bildirim Listesi */}
          <div className="max-h-48 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.slice(0, 10).map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-2 border-b last:border-none hover:bg-muted/30 transition-colors ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-4">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground">
                Henüz bildirim bulunmuyor
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

export default NotificationCenter