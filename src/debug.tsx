// Debug dosyası - sayfaların çalışma durumunu test etmek için
import { AppView } from './App'

export const debugInfo = {
  availableViews: [
    'dashboard',
    'strategies', 
    'backtest',
    'live',
    'portfolio',
    'analysis',
    'economic',
    'summary',
    'project-analysis',
    'test',
    'settings'
  ] as AppView[],
  
  sidebarItems: [
    { id: 'dashboard', label: 'Anasayfa' },
    { id: 'strategies', label: 'Stratejiler' },
    { id: 'live', label: 'Çalışan Stratejiler' },
    { id: 'backtest', label: 'Backtesting' },
    { id: 'portfolio', label: 'Portföy' },
    { id: 'analysis', label: 'Piyasa Analizi' },
    { id: 'economic', label: 'Ekonomik Takvim' },
    { id: 'summary', label: 'Özet' },
    { id: 'project-analysis', label: 'Proje Durumu' },
    { id: 'test', label: 'Test' },
    { id: 'settings', label: 'API Ayarları' }
  ]
}

console.log('✅ Tüm sayfalar tanımlandı:', debugInfo.availableViews)