import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export interface Notification {
  id: string
  message: string
  time: string
  type: 'success' | 'info' | 'warning' | 'error'
}

interface NotificationCenterProps {
  className?: string
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Global notification function'ı pencereye ekle
  useEffect(() => {
    const pushNotification = (message: string, type: Notification['type'] = 'info') => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        message,
        time: new Date().toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        type
      }
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Max 10 bildirim
    }

    // Global erişim için window'a ekle
    ;(window as any).pushNotification = pushNotification

    return () => {
      delete (window as any).pushNotification
    }
  }, [])

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-blue-500'
    }
  }

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  const clearNotifications = () => {
    setNotifications([])
    setIsOpen(false)
  }

  const latestNotification = notifications[0]

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="w-full">
            {/* Son bildirim gösterici kutu */}
            <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md text-xs shadow-sm cursor-pointer hover:bg-muted/80 transition-colors">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Bell className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                {latestNotification ? (
                  <>
                    <span className="text-xs">{getTypeIcon(latestNotification.type)}</span>
                    <span className="truncate flex-1">
                      {latestNotification.message}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Henüz bildirim yok</span>
                )}
              </div>
              
              {latestNotification && (
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-muted-foreground">{latestNotification.time}</span>
                  {notifications.length > 1 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      +{notifications.length - 1}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[280px] p-0" align="start" side="bottom">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-sm font-semibold">Son Bildirimler</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearNotifications}
                  className="text-xs h-7 px-2"
                >
                  Temizle
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="max-h-[300px]">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Henüz bildirim bulunmuyor
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification, index) => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(notification.type)} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  )
}