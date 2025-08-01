import React, { createContext, useContext, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export interface Activity {
  id: string
  title: string
  timeAgo: string
  color: string
  type: 'success' | 'info' | 'warning' | 'error'
  timestamp: Date
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (title: string, type?: Activity['type']) => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useKV<Activity[]>('recent-activities', [
    {
      id: '1',
      title: 'Grid Bot stratejisi başlatıldı',
      timeAgo: '2 dakika önce',
      color: 'bg-green-500',
      type: 'success',
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: '2',
      title: 'BTCUSDT alım sinyali',
      timeAgo: '5 dakika önce',
      color: 'bg-blue-500',
      type: 'info',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Backtest tamamlandı',
      timeAgo: '12 dakika önce',
      color: 'bg-yellow-500',
      type: 'warning',
      timestamp: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
      id: '4',
      title: 'Stop-loss tetiklendi',
      timeAgo: '18 dakika önce',
      color: 'bg-red-500',
      type: 'error',
      timestamp: new Date(Date.now() - 18 * 60 * 1000)
    },
    {
      id: '5',
      title: 'ETHUSDT satış işlemi tamamlandı',
      timeAgo: '25 dakika önce',
      color: 'bg-green-500',
      type: 'success',
      timestamp: new Date(Date.now() - 25 * 60 * 1000)
    },
    {
      id: '6',
      title: 'AI strateji önerisi oluşturuldu',
      timeAgo: '32 dakika önce',
      color: 'bg-blue-500',
      type: 'info',
      timestamp: new Date(Date.now() - 32 * 60 * 1000)
    }
  ])

  const addActivity = useCallback((title: string, type: Activity['type'] = 'info') => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      title,
      timeAgo: 'Şimdi',
      color: type === 'success' ? 'bg-green-500' : 
             type === 'warning' ? 'bg-yellow-500' : 
             type === 'error' ? 'bg-red-500' : 'bg-blue-500',
      type,
      timestamp: new Date()
    }
    
    // Yeni aktiviteyi başa ekle, maksimum 20 aktivite tut
    const updatedActivities = [newActivity, ...activities.slice(0, 19)]
    setActivities(updatedActivities)
    
    // Toast bildirimi göster
    const getToastIcon = (activityType: Activity['type']) => {
      switch (activityType) {
        case 'success': return '✅'
        case 'info': return 'ℹ️'
        case 'warning': return '⚠️'
        case 'error': return '❌'
        default: return '🔔'
      }
    }

    toast(`${getToastIcon(type)} ${title}`, {
      description: 'Şimdi',
      duration: 4000,
    })
  }, [activities, setActivities])

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider')
  }
  return context
}