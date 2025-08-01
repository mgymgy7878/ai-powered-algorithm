import React, { useState, useEffect } from 'react'
import { Bell, X } from '@phosphor-icons/react'
import { Button } from './button'

interface Notification {
  id: string
  message: string
  time: string
  type?: 'success' | 'error' | 'warning' | 'info'
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'AI Trading Yöneticisi hazır',
      time: new Date().toLocaleTimeString('tr-TR'),
      type: 'info'
    }
  ])
  const [showAll, setShowAll] = useState(false)

  // Global bildirim fonksiyonu - diğer bileşenler tarafından kullanılabilir
  const pushNotification = (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => {
    const newNote: Notification = {
      id: Date.now().toString(),
      message: msg,
      time: new Date().toLocaleTimeString('tr-TR'),
      type: type || 'info'
    }
    setNotifications((prev) => [newNote, ...prev.slice(0, 9)]) // Son 10 bildirimi sakla
  }

  // Global fonksiyonu window objesine ekle
  useEffect(() => {
    ;(window as any).pushNotification = pushNotification
    return () => {
      delete (window as any).pushNotification
    }
  }, [])

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      default: return 'text-blue-600'
    }
  }

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      default: return '📢'
    }
  }

  return (
    <div className="relative w-full">
      {/* Son Bildirim Kutusu */}
      <div 
        className="w-full flex justify-between items-center px-3 py-2 bg-muted rounded-md text-xs shadow-sm cursor-pointer hover:bg-muted/80 transition-colors"
        onClick={() => setShowAll(!showAll)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Bell className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">{notifications[0]?.message ?? "Henüz bildirim yok"}</span>
        </div>
        <span className={`text-xs ml-2 flex-shrink-0 ${getTypeColor(notifications[0]?.type)}`}>
          {notifications[0]?.time ?? ""}
        </span>
      </div>
      
      {/* Geçmiş Bildirimler Açılır Paneli */}
      {showAll && notifications.length > 1 && (
        <div className="absolute z-50 mt-2 top-full left-0 w-full max-h-56 overflow-auto rounded-md border bg-background shadow-lg">
          <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
            <span className="text-xs font-semibold">Geçmiş Bildirimler</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(false)}
              className="h-4 w-4 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {notifications.slice(1).map((n) => (
              <div key={n.id} className="px-3 py-2 border-b last:border-none hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-2">
                  <span className="text-xs mt-0.5">{getTypeIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground break-words">{n.message}</p>
                    <p className={`text-xs mt-1 ${getTypeColor(n.type)}`}>{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}