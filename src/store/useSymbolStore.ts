import { create } from 'zustand'
import { AssetType, AssetInfo, getAssetInfo } from '../services/chartDataResolver'

interface SymbolState {
  // Aktif sembol ve bilgileri
  currentSymbol: string
  currentAssetInfo: AssetInfo | null
  
  // Arama geçmişi
  searchHistory: string[]
  
  // Grafik durumu
  isFullscreen: boolean
  isLoading: boolean
  
  // Actions
  setSymbol: (symbol: string) => void
  toggleFullscreen: () => void
  setLoading: (loading: boolean) => void
  addToHistory: (symbol: string) => void
  clearHistory: () => void
}

export const useSymbolStore = create<SymbolState>((set, get) => ({
  currentSymbol: 'BTCUSDT',
  currentAssetInfo: getAssetInfo('BTCUSDT'),
  searchHistory: ['BTCUSDT', 'ETHUSDT', 'AAPL', 'USDTRY', 'XAUUSD'],
  isFullscreen: false,
  isLoading: false,
  
  setSymbol: (symbol: string) => {
    const assetInfo = getAssetInfo(symbol)
    set({
      currentSymbol: symbol.toUpperCase(),
      currentAssetInfo: assetInfo
    })
    
    // Geçmişe ekle
    get().addToHistory(symbol)
  },
  
  toggleFullscreen: () => {
    set((state) => ({ isFullscreen: !state.isFullscreen }))
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },
  
  addToHistory: (symbol: string) => {
    set((state) => {
      const upperSymbol = symbol.toUpperCase()
      const newHistory = [upperSymbol, ...state.searchHistory.filter(s => s !== upperSymbol)]
      return {
        searchHistory: newHistory.slice(0, 10) // Son 10 arama
      }
    })
  },
  
  clearHistory: () => {
    set({ searchHistory: [] })
  }
}))