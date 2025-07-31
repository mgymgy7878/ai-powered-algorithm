// Güvenli nesne erişim yardımcı fonksiyonları

export const safeGet = <T, K extends keyof T>(obj: T | null | undefined, key: K, defaultValue?: T[K]): T[K] | undefined => {
  if (!obj || typeof obj !== 'object') {
    return defaultValue
  }
  return obj[key] ?? defaultValue
}

export const safeGetNested = <T>(obj: T | null | undefined, path: string, defaultValue?: any): any => {
  if (!obj || typeof obj !== 'object') {
    return defaultValue
  }
  
  try {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? (current as any)[key] : undefined
    }, obj) ?? defaultValue
  } catch {
    return defaultValue
  }
}

export const safeParseFloat = (value: string | number | null | undefined, defaultValue: number = 0): number => {
  if (value === null || value === undefined) return defaultValue
  if (typeof value === 'number') return isNaN(value) ? defaultValue : value
  
  const parsed = parseFloat(value.toString())
  return isNaN(parsed) ? defaultValue : parsed
}

export const safeParseInt = (value: string | number | null | undefined, defaultValue: number = 0): number => {
  if (value === null || value === undefined) return defaultValue
  if (typeof value === 'number') return isNaN(value) ? defaultValue : Math.floor(value)
  
  const parsed = parseInt(value.toString(), 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export const safeArrayAccess = <T>(arr: T[] | null | undefined, index: number, defaultValue?: T): T | undefined => {
  if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
    return defaultValue
  }
  return arr[index] ?? defaultValue
}

// Piyasa verisi için özel güvenli erişim
export const safeMarketData = (data: any) => ({
  symbol: data?.symbol || 'UNKNOWN',
  price: safeParseFloat(data?.lastPrice || data?.price),
  priceChangePercent: safeParseFloat(data?.priceChangePercent),
  highPrice: safeParseFloat(data?.highPrice),
  lowPrice: safeParseFloat(data?.lowPrice),
  volume: safeParseFloat(data?.volume),
  lastPrice: safeParseFloat(data?.lastPrice || data?.price),
  change24h: safeParseFloat(data?.priceChangePercent),
  high24h: safeParseFloat(data?.highPrice),
  low24h: safeParseFloat(data?.lowPrice),
  volume24h: safeParseFloat(data?.volume)
})