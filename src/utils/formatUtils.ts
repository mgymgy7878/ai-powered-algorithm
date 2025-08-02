/**
 * Güvenli sayı formatlama fonksiyonları
 * undefined, null veya geçersiz değerler için güvenli varsayılanlar sağlar
 */

/**
 * Sayıyı güvenli şekilde locale string'e çevirir
 * @param value - Formatlanacak sayı
 * @param locale - Locale kodu (varsayılan: 'tr-TR')
 * @param options - Intl.NumberFormat seçenekleri
 * @returns Formatlanmış string veya varsayılan değer
 */
export const safeToLocaleString = (
  value: number | undefined | null,
  locale: string = 'tr-TR',
  options?: Intl.NumberFormatOptions
): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0'
  }
  
  try {
    return value.toLocaleString(locale, options)
  } catch (error) {
    console.warn('Sayı formatlama hatası:', error)
    return String(value)
  }
}

/**
 * Para birimi formatı için güvenli fonksiyon
 * @param value - Formatlanacak miktar
 * @param currency - Para birimi kodu (varsayılan: 'USD')
 * @param locale - Locale kodu (varsayılan: 'tr-TR')
 * @returns Formatlanmış para birimi string'i
 */
export const safeCurrencyFormat = (
  value: number | undefined | null,
  currency: string = 'USD',
  locale: string = 'tr-TR'
): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return `$0.00`
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(value)
  } catch (error) {
    console.warn('Para birimi formatlama hatası:', error)
    return `$${value.toFixed(2)}`
  }
}

/**
 * Yüzde formatı için güvenli fonksiyon
 * @param value - Formatlanacak yüzde değeri (0.15 = %15)
 * @param locale - Locale kodu (varsayılan: 'tr-TR')
 * @param decimals - Ondalık basamak sayısı (varsayılan: 2)
 * @returns Formatlanmış yüzde string'i
 */
export const safePercentFormat = (
  value: number | undefined | null,
  locale: string = 'tr-TR',
  decimals: number = 2
): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0%'
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value)
  } catch (error) {
    console.warn('Yüzde formatlama hatası:', error)
    return `${(value * 100).toFixed(decimals)}%`
  }
}

/**
 * Tarih formatı için güvenli fonksiyon
 * @param value - Formatlanacak tarih (Date, number, string)
 * @param locale - Locale kodu (varsayılan: 'tr-TR')
 * @param options - Intl.DateTimeFormat seçenekleri
 * @returns Formatlanmış tarih string'i
 */
export const safeDateFormat = (
  value: Date | number | string | undefined | null,
  locale: string = 'tr-TR',
  options?: Intl.DateTimeFormatOptions
): string => {
  if (value === undefined || value === null) {
    return 'N/A'
  }
  
  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return 'Geçersiz Tarih'
    }
    
    return date.toLocaleString(locale, options)
  } catch (error) {
    console.warn('Tarih formatlama hatası:', error)
    return 'Geçersiz Tarih'
  }
}