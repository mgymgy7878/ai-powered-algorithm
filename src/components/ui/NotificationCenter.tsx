import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from './button'

export interface Notification {
  id: string
  message: string
  time: string
  type?: 'info' | 'success' | 'warning' | 'error'
}

interface NotificationCenterProps {
  notifications: Notification[]
  className?: string
}

export function NotificationCenter({ notifications, className = '' }: NotificationCenterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // En son bildirimi al
  const latestNotification = notifications[0]
  
  return (
    <div className={`relative ${className}`}>
      {/* Ana bildirim kutusu - son bildirimi gösterir */}
      <div 
        className="w-full flex justify-between items-center px-3 py-2 bg-muted rounded-md text-xs shadow-sm cursor-pointer hover:bg-muted/80 transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Bell className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">
            {latestNotification?.message ?? "Henüz bildirim yok"}
          </span>
        </div>
        <span className="text-muted-foreground ml-2 flex-shrink-0">
          {latestNotification?.time ?? ""}
        </span>
      </div>

      {/* Açılır bildirim listesi */}
      {isDropdownOpen && notifications.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 border rounded-md bg-background shadow-lg text-xs max-h-48 overflow-auto z-50">
          {notifications.map((notification, index) => (
            <div 
              key={notification.id} 
              className={`px-3 py-2 border-b last:border-none hover:bg-muted/50 ${
                index === 0 ? 'bg-muted/30' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <Bell className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="break-words">{notification.message}</p>
                  <p className="text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Boş durum için açılır liste */}
      {isDropdownOpen && notifications.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 border rounded-md bg-background shadow-lg text-xs p-3 z-50">
          <p className="text-muted-foreground text-center">Henüz bildirim bulunmuyor</p>
        </div>
      )}
    </div>
  )
}

// Varsayılan bildirimler (örnek)
export const sampleNotifications: Notification[] = [
  {
    id: '1',
    message: 'Grid Bot stratejisi başarıyla başlatıldı',
    time: '2 dakika önce',
    type: 'success'
  },
  {
    id: '2', 
    message: 'BTCUSDT alım sinyali tetiklendi',
    time: '5 dakika önce',
    type: 'info'
  },
  {
    id: '3',
    message: 'Scalping stratejisi durduruldu',
    time: '8 dakika önce',
    type: 'warning'
  },
  {
    id: '4',
    message: 'Portföy değeri $50,000 seviyesini aştı',
    time: '15 dakika önce',
    type: 'success'
  },
  {
    id: '5',
    message: 'API bağlantısı başarılı',
    time: '1 saat önce',
    type: 'info'
  }
]