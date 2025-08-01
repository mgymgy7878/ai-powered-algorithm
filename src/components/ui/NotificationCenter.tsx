import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Bell, X } from '@phosphor-icons/react'

type Notification = {
  id: string
  message: string
  time: string
  type?: 'info' | 'success' | 'warning' | 'error'
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Bildirim ekleme fonksiyonu - global olarak erişilebilir
  const pushNotification = (msg: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newNote: Notification = {
      id: Date.now().toString(),
      message: msg,
      time: new Date().toLocaleTimeString("tr-TR"),
      type
    }
    setNotifications((prev) => [newNote, ...prev.slice(0, 19)]) // Son 20 bildirimi tut
  }

  // Global bildirim fonksiyonunu window'a ekle
  useEffect(() => {
    (window as any).pushNotification = pushNotification
    return () => {
      delete (window as any).pushNotification
    }
  }, [])

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  const latestNotification = notifications[0]

  return (
    <div className="relative">
      {/* Son Bildirim Kutusu */}
      {latestNotification && (
        <div 
          className="w-full flex justify-between items-center px-3 py-2 bg-muted rounded-md text-xs shadow-sm cursor-pointer border"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Bell className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="truncate">{latestNotification.message}</span>
          </div>
          <span className="text-muted-foreground ml-2 flex-shrink-0">
            {latestNotification.time}
          </span>
        </div>
      )}

      {/* Bildirim yoksa */}
      {!latestNotification && (
        <div className="w-full flex justify-center items-center px-3 py-2 bg-muted rounded-md text-xs shadow-sm opacity-50">
          <Bell className="w-3 h-3 text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Henüz bildirim yok</span>
        </div>
      )}

      {/* Dropdown Menü */}
      {isDropdownOpen && notifications.length > 1 && (
        <div className="absolute top-full mt-1 left-0 right-0 border rounded-md bg-background shadow-lg text-xs max-h-64 overflow-hidden z-[60]">
          <div className="flex justify-between items-center px-3 py-2 border-b bg-muted">
            <span className="font-medium">Geçmiş Bildirimler</span>
            <Button
              variant="ghost"
              size="icon"
              className="w-4 h-4 p-0"
              onClick={() => setIsDropdownOpen(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {notifications.slice(1).map((notification) => (
              <div 
                key={notification.id} 
                className={`px-3 py-2 border-b last:border-none hover:bg-muted/50 ${getTypeColor(notification.type)}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="flex-1 min-w-0 text-xs">{notification.message}</p>
                  <span className="text-muted-foreground flex-shrink-0 text-[10px]">
                    {notification.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {notifications.length > 1 && (
            <div className="px-3 py-2 border-t bg-muted">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs h-6"
                onClick={() => {
                  setNotifications([])
                  setIsDropdownOpen(false)
                }}
              >
                Tüm Bildirimleri Temizle
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Global bildirim fonksiyonu için tip tanımı
declare global {
  interface Window {
    pushNotification: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
  }
}