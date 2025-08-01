import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export type Notification = {
  id: string
  message: string
  time: string
  type?: 'info' | 'success' | 'warning' | 'error'
  read?: boolean
}

// Global notification state
let globalNotifications: Notification[] = []
let listeners: (() => void)[] = []

// Notification management functions
export const addNotification = (notification: Omit<Notification, 'id' | 'time'>) => {
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    time: new Date().toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    read: false
  }
  
  globalNotifications = [newNotification, ...globalNotifications]
  
  // Notify all listeners
  listeners.forEach(listener => listener())
}

export const markNotificationAsRead = (id: string) => {
  globalNotifications = globalNotifications.map(notification =>
    notification.id === id ? { ...notification, read: true } : notification
  )
  listeners.forEach(listener => listener())
}

export const clearAllNotifications = () => {
  globalNotifications = []
  listeners.forEach(listener => listener())
}

interface NotificationCenterProps {
  className?: string
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(globalNotifications)
  
  // Subscribe to notification updates
  useEffect(() => {
    const listener = () => {
      setNotifications([...globalNotifications])
    }
    
    listeners.push(listener)
    
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])
  
  const unreadCount = notifications.filter(n => !n.read).length
  const latestNotification = notifications[0]

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-blue-500'
    }
  }

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId)
  }

  const handleClearAll = () => {
    clearAllNotifications()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Ana Bildirim Kutusu */}
      <div 
        className="w-full flex justify-between items-center px-3 py-2 bg-muted rounded-md text-xs shadow-sm cursor-pointer hover:bg-muted/80 transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span className="flex-1 truncate">
            {latestNotification?.message ?? "Henüz bildirim yok"}
          </span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
              {unreadCount}
            </Badge>
          )}
        </div>
        <span className="text-muted-foreground ml-2">
          {latestNotification?.time ?? ""}
        </span>
      </div>

      {/* Dropdown Menü */}
      {isDropdownOpen && (
        <Card className="absolute top-full left-0 w-80 mt-1 z-50 shadow-lg">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-semibold text-sm">Bildirimler</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs" 
                  onClick={handleClearAll}
                >
                  Temizle
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-6 h-6"
                onClick={() => setIsDropdownOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Henüz bildirim bulunmuyor
              </div>
            ) : (
              <ScrollArea className="max-h-64">
                <div className="space-y-1 p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${
                        !notification.read ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getTypeColor(notification.type)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}