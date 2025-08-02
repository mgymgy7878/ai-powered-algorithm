import { websocketService } from '@/services/websocketService'

/**
 * WebSocket Test Suite - Otomatik test ve validasyon
 */
export class WebSocketTestSuite {
  private testResults: Map<string, boolean> = new Map()
  private errors: string[] = []

  async runAllTests(): Promise<{ passed: number, failed: number, errors: string[] }> {
    console.log('🚀 WebSocket Test Suite başlatılıyor...')
    
    this.testResults.clear()
    this.errors.clear()

    // Test 1: Ticker bağlantısı
    await this.testTickerConnection()
    
    // Test 2: Kline bağlantısı
    await this.testKlineConnection()
    
    // Test 3: Depth bağlantısı
    await this.testDepthConnection()
    
    // Test 4: Trade bağlantısı
    await this.testTradeConnection()
    
    // Test 5: Multi-ticker bağlantısı
    await this.testMultiTickerConnection()
    
    // Test 6: Bağlantı durumu kontrolü
    await this.testConnectionStatus()
    
    // Test 7: Bağlantı kapatma
    await this.testDisconnection()
    
    // Test 8: Yeniden bağlanma
    await this.testReconnection()

    const passed = Array.from(this.testResults.values()).filter(Boolean).length
    const failed = this.testResults.size - passed

    console.log(`✅ Test tamamlandı: ${passed} başarılı, ${failed} başarısız`)
    
    return {
      passed,
      failed,
      errors: [...this.errors]
    }
  }

  private async testTickerConnection(): Promise<void> {
    return new Promise((resolve) => {
      console.log('🔍 Test 1: Ticker bağlantısı...')
      
      let dataReceived = false
      const timeout = setTimeout(() => {
        if (!dataReceived) {
          this.testResults.set('ticker', false)
          this.errors.push('Ticker: Veri alınamadı (10s timeout)')
          resolve()
        }
      }, 10000)

      try {
        websocketService.subscribeToTicker('BTCUSDT', (data) => {
          if (!dataReceived) {
            dataReceived = true
            clearTimeout(timeout)
            
            // Veri doğrulama
            if (data.symbol === 'BTCUSDT' && data.price && data.volume) {
              this.testResults.set('ticker', true)
              console.log('✅ Ticker testi başarılı')
            } else {
              this.testResults.set('ticker', false)
              this.errors.push('Ticker: Geçersiz veri formatı')
            }
            resolve()
          }
        })
      } catch (error) {
        clearTimeout(timeout)
        this.testResults.set('ticker', false)
        this.errors.push(`Ticker: ${error}`)
        resolve()
      }
    })
  }

  private async testKlineConnection(): Promise<void> {
    return new Promise((resolve) => {
      console.log('🔍 Test 2: Kline bağlantısı...')
      
      let dataReceived = false
      const timeout = setTimeout(() => {
        if (!dataReceived) {
          this.testResults.set('kline', false)
          this.errors.push('Kline: Veri alınamadı (10s timeout)')
          resolve()
        }
      }, 10000)

      try {
        websocketService.subscribeToKline('ETHUSDT', '1m', (data) => {
          if (!dataReceived) {
            dataReceived = true
            clearTimeout(timeout)
            
            if (data.symbol === 'ETHUSDT' && data.open && data.close && data.high && data.low) {
              this.testResults.set('kline', true)
              console.log('✅ Kline testi başarılı')
            } else {
              this.testResults.set('kline', false)
              this.errors.push('Kline: Geçersiz veri formatı')
            }
            resolve()
          }
        })
      } catch (error) {
        clearTimeout(timeout)
        this.testResults.set('kline', false)
        this.errors.push(`Kline: ${error}`)
        resolve()
      }
    })
  }

  private async testDepthConnection(): Promise<void> {
    return new Promise((resolve) => {
      console.log('🔍 Test 3: Depth bağlantısı...')
      
      let dataReceived = false
      const timeout = setTimeout(() => {
        if (!dataReceived) {
          this.testResults.set('depth', false)
          this.errors.push('Depth: Veri alınamadı (10s timeout)')
          resolve()
        }
      }, 10000)

      try {
        websocketService.subscribeToDepth('ADAUSDT', (data) => {
          if (!dataReceived) {
            dataReceived = true
            clearTimeout(timeout)
            
            if (data.symbol === 'ADAUSDT' && data.bids && data.asks && 
                data.bids.length > 0 && data.asks.length > 0) {
              this.testResults.set('depth', true)
              console.log('✅ Depth testi başarılı')
            } else {
              this.testResults.set('depth', false)
              this.errors.push('Depth: Geçersiz veri formatı')
            }
            resolve()
          }
        })
      } catch (error) {
        clearTimeout(timeout)
        this.testResults.set('depth', false)
        this.errors.push(`Depth: ${error}`)
        resolve()
      }
    })
  }

  private async testTradeConnection(): Promise<void> {
    return new Promise((resolve) => {
      console.log('🔍 Test 4: Trade bağlantısı...')
      
      let dataReceived = false
      const timeout = setTimeout(() => {
        if (!dataReceived) {
          this.testResults.set('trades', false)
          this.errors.push('Trades: Veri alınamadı (15s timeout)')
          resolve()
        }
      }, 15000) // Trades için daha uzun timeout

      try {
        websocketService.subscribeToTrades('XRPUSDT', (data) => {
          if (!dataReceived) {
            dataReceived = true
            clearTimeout(timeout)
            
            if (data.symbol === 'XRPUSDT' && data.price && data.quantity) {
              this.testResults.set('trades', true)
              console.log('✅ Trades testi başarılı')
            } else {
              this.testResults.set('trades', false)
              this.errors.push('Trades: Geçersiz veri formatı')
            }
            resolve()
          }
        })
      } catch (error) {
        clearTimeout(timeout)
        this.testResults.set('trades', false)
        this.errors.push(`Trades: ${error}`)
        resolve()
      }
    })
  }

  private async testMultiTickerConnection(): Promise<void> {
    return new Promise((resolve) => {
      console.log('🔍 Test 5: Multi-ticker bağlantısı...')
      
      const receivedSymbols = new Set<string>()
      const targetSymbols = ['SOLUSDT', 'DOGEUSDT', 'MATICUSDT']
      
      const timeout = setTimeout(() => {
        if (receivedSymbols.size < targetSymbols.length) {
          this.testResults.set('multi-ticker', false)
          this.errors.push(`Multi-ticker: Sadece ${receivedSymbols.size}/${targetSymbols.length} sembol verisi alındı`)
        } else {
          this.testResults.set('multi-ticker', true)
          console.log('✅ Multi-ticker testi başarılı')
        }
        resolve()
      }, 15000)

      try {
        websocketService.subscribeToMultipleTickers(targetSymbols, (data) => {
          receivedSymbols.add(data.symbol)
          
          if (receivedSymbols.size === targetSymbols.length) {
            clearTimeout(timeout)
            this.testResults.set('multi-ticker', true)
            console.log('✅ Multi-ticker testi başarılı')
            resolve()
          }
        })
      } catch (error) {
        clearTimeout(timeout)
        this.testResults.set('multi-ticker', false)
        this.errors.push(`Multi-ticker: ${error}`)
        resolve()
      }
    })
  }

  private async testConnectionStatus(): Promise<void> {
    console.log('🔍 Test 6: Bağlantı durumu kontrolü...')
    
    try {
      const activeConnections = websocketService.getActiveConnections()
      const health = websocketService.getConnectionHealth()
      
      if (activeConnections.length > 0 && health.totalConnections > 0) {
        this.testResults.set('status', true)
        console.log('✅ Bağlantı durumu testi başarılı')
      } else {
        this.testResults.set('status', false)
        this.errors.push('Status: Aktif bağlantı bulunamadı')
      }
    } catch (error) {
      this.testResults.set('status', false)
      this.errors.push(`Status: ${error}`)
    }
  }

  private async testDisconnection(): Promise<void> {
    console.log('🔍 Test 7: Bağlantı kapatma...')
    
    try {
      const activeConnectionsBefore = websocketService.getActiveConnections().length
      
      // Bir bağlantıyı kapat
      if (activeConnectionsBefore > 0) {
        const firstConnection = websocketService.getActiveConnections()[0]
        websocketService.disconnect(firstConnection)
        
        // Kısa bir bekleme
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const activeConnectionsAfter = websocketService.getActiveConnections().length
        
        if (activeConnectionsAfter < activeConnectionsBefore) {
          this.testResults.set('disconnect', true)
          console.log('✅ Bağlantı kapatma testi başarılı')
        } else {
          this.testResults.set('disconnect', false)
          this.errors.push('Disconnect: Bağlantı kapatılamadı')
        }
      } else {
        this.testResults.set('disconnect', true)
        console.log('✅ Bağlantı kapatma testi başarılı (bağlantı yoktu)')
      }
    } catch (error) {
      this.testResults.set('disconnect', false)
      this.errors.push(`Disconnect: ${error}`)
    }
  }

  private async testReconnection(): Promise<void> {
    return new Promise((resolve) => {
      console.log('🔍 Test 8: Yeniden bağlanma...')
      
      let reconnected = false
      const timeout = setTimeout(() => {
        if (!reconnected) {
          this.testResults.set('reconnect', false)
          this.errors.push('Reconnect: Yeniden bağlanma başarısız (20s timeout)')
          resolve()
        }
      }, 20000)

      try {
        // Yeni bir bağlantı başlat
        websocketService.subscribeToTicker('BNBUSDT', (data) => {
          if (!reconnected) {
            reconnected = true
            clearTimeout(timeout)
            this.testResults.set('reconnect', true)
            console.log('✅ Yeniden bağlanma testi başarılı')
            resolve()
          }
        })
      } catch (error) {
        clearTimeout(timeout)
        this.testResults.set('reconnect', false)
        this.errors.push(`Reconnect: ${error}`)
        resolve()
      }
    })
  }

  // Test sonuçlarını temizle ve tüm bağlantıları kapat
  cleanup(): void {
    console.log('🧹 Test temizliği yapılıyor...')
    websocketService.disconnectAll()
    this.testResults.clear()
    this.errors.clear()
  }

  // Test raporu oluştur
  generateReport(): string {
    const passed = Array.from(this.testResults.values()).filter(Boolean).length
    const total = this.testResults.size
    const failed = total - passed
    
    let report = `# WebSocket Test Raporu\n\n`
    report += `**Tarih:** ${new Date().toLocaleString('tr-TR')}\n`
    report += `**Sonuç:** ${passed}/${total} test başarılı\n\n`
    
    report += `## Test Sonuçları\n\n`
    
    for (const [testName, result] of this.testResults) {
      const status = result ? '✅ BAŞARILI' : '❌ BAŞARISIZ'
      report += `- **${testName}:** ${status}\n`
    }
    
    if (this.errors.length > 0) {
      report += `\n## Hatalar\n\n`
      this.errors.forEach((error, index) => {
        report += `${index + 1}. ${error}\n`
      })
    }
    
    return report
  }
}

// Global test runner - konsol üzerinden erişilebilir
declare global {
  interface Window {
    runWebSocketTests: () => Promise<void>
    webSocketTestSuite: WebSocketTestSuite
  }
}

// Test suite'i global objeye ekle
if (typeof window !== 'undefined') {
  window.webSocketTestSuite = new WebSocketTestSuite()
  
  window.runWebSocketTests = async () => {
    const suite = new WebSocketTestSuite()
    const results = await suite.runAllTests()
    
    console.log('\n📊 TEST RAPORU:')
    console.log(`✅ Başarılı: ${results.passed}`)
    console.log(`❌ Başarısız: ${results.failed}`)
    
    if (results.errors.length > 0) {
      console.log('\n🔍 HATALAR:')
      results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`)
      })
    }
    
    // Raporu markdown olarak oluştur
    const report = suite.generateReport()
    console.log('\n📄 MARKDOWN RAPORU:')
    console.log(report)
    
    // Temizlik
    suite.cleanup()
    
    return results
  }
}

export const webSocketTestSuite = new WebSocketTestSuite()