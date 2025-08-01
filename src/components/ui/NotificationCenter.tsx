import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bell } from 'lucide-react'

export type Notification = {
  id: string
  message: string
  time: string
  type?: 'success' | 'info' | 'warning' | 'error'
}

interface NotificationCenterProps {
  notifications: Notification[]
  className?: string
}

export function NotificationCenter({ notifications, className = "" }: NotificationCenterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const latestNotification = notifications[0]

  return (
    <div className={`relative ${className}`}>
      {/* Son bildirim kutusu */}
      <div 
        className="w-full flex justify-between items-center px-3 py-2 bg-muted rounded-md text-xs shadow-sm cursor-pointer hover:bg-muted/80 transition-all"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-2">
          <Bell className="w-3 h-3 text-muted-foreground" />
          <span className="flex-1 truncate">
            {latestNotification?.message ?? "Henüz bildirim yok"}
          </span>
        </div>
        <span className="text-muted-foreground ml-2">
          {latestNotification?.time ?? ""}
        </span>
      </div>

      {/* Geçmiş bildirimler dropdown */}
      {isDropdownOpen && notifications.length > 1 && (
        <Card className="absolute top-full left-0 right-0 mt-1 border shadow-md text-xs max-h-48 overflow-auto z-50 bg-background">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Geçmiş Bildirimler
            </div>
            {notifications.slice(1).map((notification) => (
              <div key={notification.id} className="px-2 py-2 border-b last:border-none hover:bg-muted/50 rounded-sm">
                <p className="text-xs">{notification.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Dropdown dışına tıklanınca kapat */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}