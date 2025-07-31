import { APISettings } from '../types/api'

export class AIService {
  private static instance: AIService
  private settings: APISettings | null = null

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  setSettings(settings: APISettings) {
    if (!settings) {
      console.warn('AI Service: Attempted to set null/undefined settings')
      return
    }
    this.settings = settings
  }

  getSettings(): APISettings | null {
    return this.settings
  }

  isConfigured(): boolean {
    if (!this.settings) return false
    
    try {
      // Güvenli erişim için varsayılan değerler ve açık boolean kontrolü
      const openaiReady = this.settings.openai?.enabled === true && this.settings.openai?.apiKey?.trim()
      const anthropicReady = this.settings.anthropic?.enabled === true && this.settings.anthropic?.apiKey?.trim()
      
      return !!(openaiReady || anthropicReady)
    } catch (error) {
      console.error('AI Service configuration check error:', error)
      return false
    }
  }

  async generateCode(prompt: string, provider?: 'openai' | 'anthropic'): Promise<string> {
    if (!this.settings) {
      throw new Error('AI servisleri yapılandırılmamış. Lütfen API anahtarlarını ayarlayın.')
    }

    // Auto-select provider if not specified - Güvenli erişim için açık boolean kontrolü
    if (!provider) {
      if (this.settings.openai?.enabled === true && this.settings.openai?.apiKey) {
        provider = 'openai'
      } else if (this.settings.anthropic?.enabled === true && this.settings.anthropic?.apiKey) {
        provider = 'anthropic'
      } else {
        throw new Error('Hiçbir AI servisi etkin değil. Lütfen enaz birini etkinleştirin.')
      }
    }

    const config = provider === 'openai' ? this.settings.openai : this.settings.anthropic

    // Güvenli erişim için açık boolean ve var kontrolü
    if (!config?.enabled || config.enabled !== true || !config?.apiKey) {
      throw new Error(`${provider} servisi etkin değil veya API anahtarı eksik.`)
    }

    try {
      if (provider === 'openai') {
        return await this.callOpenAI(prompt, config.model, config.apiKey)
      } else {
        return await this.callAnthropic(prompt, config.model, config.apiKey)
      }
    } catch (error) {
      console.error(`AI servis hatası (${provider}):`, error)
      throw new Error(`AI kod üretimi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    }
  }

  private async callOpenAI(prompt: string, model: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Sen bir C# trading stratejisi geliştirme uzmanısın. Kullanıcının Türkçe taleplerini anlayarak temiz, açıklamalı C# kodu üretiyorsun.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'API çağrısı başarısız' } }))
      throw new Error(error.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Kod üretilemedi'
  }

  private async callAnthropic(prompt: string, model: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Sen bir C# trading stratejisi geliştirme uzmanısın. Kullanıcının Türkçe taleplerini anlayarak temiz, açıklamalı C# kodu üretiyorsun.\n\n${prompt}`
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'API çağrısı başarısız' } }))
      throw new Error(error.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.content[0]?.text || 'Kod üretilemedi'
  }

  async explainCode(code: string, provider?: 'openai' | 'anthropic'): Promise<string> {
    const prompt = `Aşağıdaki C# trading stratejisi kodunu Türkçe olarak açıkla. Kodun ne yaptığını, hangi indikatörleri kullandığını ve nasıl çalıştığını detaylı bir şekilde anlat:\n\n${code}`
    return this.generateCode(prompt, provider)
  }

  async optimizeCode(code: string, provider?: 'openai' | 'anthropic'): Promise<string> {
    const prompt = `Aşağıdaki C# trading stratejisi kodunu optimize et. Performansı artır, gereksiz hesaplamaları kaldır ve daha temiz hale getir. Optimizasyonları Türkçe açıklama satırları ile belirt:\n\n${code}`
    return this.generateCode(prompt, provider)
  }

  async fixCode(code: string, error: string, provider?: 'openai' | 'anthropic'): Promise<string> {
    const prompt = `Aşağıdaki C# trading stratejisi kodunda hata var. Hatayı düzelt ve çalışır hale getir. Hata mesajı: "${error}"\n\nKod:\n${code}\n\nDüzeltilen kodu ve neyin değiştirildiğini Türkçe açıklama satırları ile ver.`
    return this.generateCode(prompt, provider)
  }

  async generateStrategy(description: string, provider?: 'openai' | 'anthropic'): Promise<string> {
    const prompt = `Aşağıdaki strateji açıklamasına göre tam bir C# trading stratejisi kodu yaz. Kod, OnBarUpdate() metodunu içermeli ve trading mantığını gerçekleştirmeli. Açıklama: "${description}"`
    return this.generateCode(prompt, provider)
  }

  async testConnection(provider: 'openai' | 'anthropic', apiKey: string): Promise<boolean> {
    try {
      const testPrompt = 'Test mesajı - sadece "OK" diye yanıt ver'
      
      if (provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 10
          })
        })
        return response.ok
      } else {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 10,
            messages: [{ role: 'user', content: testPrompt }]
          })
        })
        return response.ok
      }
    } catch {
      return false
    }
  }

  // AITestPanel için ek metodlar
  getConfig() {
    if (!this.settings) {
      return {
        openaiApiKey: '',
        anthropicApiKey: '',
        preferredModel: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000
      }
    }

    return {
      openaiApiKey: this.settings.openai?.apiKey || '',
      anthropicApiKey: this.settings.anthropic?.apiKey || '',
      preferredModel: this.settings.openai?.enabled ? this.settings.openai.model : this.settings.anthropic?.model || 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000
    }
  }

  async generalQuestion(prompt: string, provider?: 'openai' | 'anthropic'): Promise<{ content: string; model: string }> {
    if (!this.settings) {
      throw new Error('AI servisleri yapılandırılmamış. Lütfen API anahtarlarını ayarlayın.')
    }

    // Auto-select provider if not specified
    if (!provider) {
      if (this.settings.openai?.enabled === true && this.settings.openai?.apiKey) {
        provider = 'openai'
      } else if (this.settings.anthropic?.enabled === true && this.settings.anthropic?.apiKey) {
        provider = 'anthropic'
      } else {
        throw new Error('Hiçbir AI servisi etkin değil. Lütfen en az birini etkinleştirin.')
      }
    }

    const config = provider === 'openai' ? this.settings.openai : this.settings.anthropic

    if (!config?.enabled || !config?.apiKey) {
      throw new Error(`${provider} servisi etkin değil veya API anahtarı eksik.`)
    }

    try {
      let content: string
      if (provider === 'openai') {
        content = await this.callOpenAISimple(prompt, config.model, config.apiKey)
      } else {
        content = await this.callAnthropicSimple(prompt, config.model, config.apiKey)
      }

      return {
        content,
        model: config.model
      }
    } catch (error) {
      console.error(`AI genel soru hatası (${provider}):`, error)
      throw new Error(`AI yanıtı alınamadı: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    }
  }

  private async callOpenAISimple(prompt: string, model: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'API çağrısı başarısız' } }))
      throw new Error(error.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Yanıt alınamadı'
  }

  private async callAnthropicSimple(prompt: string, model: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'API çağrısı başarısız' } }))
      throw new Error(error.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.content[0]?.text || 'Yanıt alınamadı'
  }

  async generateStrategyCode(description: string, provider?: 'openai' | 'anthropic'): Promise<{ content: string; model: string }> {
    if (!this.settings) {
      throw new Error('AI servisleri yapılandırılmamış. Lütfen API anahtarlarını ayarlayın.')
    }

    // Auto-select provider if not specified
    if (!provider) {
      if (this.settings.openai?.enabled === true && this.settings.openai?.apiKey) {
        provider = 'openai'
      } else if (this.settings.anthropic?.enabled === true && this.settings.anthropic?.apiKey) {
        provider = 'anthropic'
      } else {
        throw new Error('Hiçbir AI servisi etkin değil. Lütfen en az birini etkinleştirin.')
      }
    }

    const config = provider === 'openai' ? this.settings.openai : this.settings.anthropic

    if (!config?.enabled || !config?.apiKey) {
      throw new Error(`${provider} servisi etkin değil veya API anahtarı eksik.`)
    }

    const strategyPrompt = `Aşağıdaki talebe göre tam bir C# trading stratejisi kodu yaz. Kod, OnBarUpdate() metodunu içermeli ve trading mantığını gerçekleştirmeli. Türkçe açıklama satırları ekle.

Talep: "${description}"

Kod şu formatta olmalı:
- using direktifleri
- namespace ve class tanımı
- Gerekli değişkenler
- OnBarUpdate() metodu
- Al/sat sinyalleri
- Risk yönetimi

Sadece çalışır C# kodu döndür, başka açıklama ekleme.`

    try {
      let content: string
      if (provider === 'openai') {
        content = await this.callOpenAI(strategyPrompt, config.model, config.apiKey)
      } else {
        content = await this.callAnthropic(strategyPrompt, config.model, config.apiKey)
      }

      return {
        content,
        model: config.model
      }
    } catch (error) {
      console.error(`AI strateji kod üretimi hatası (${provider}):`, error)
      throw new Error(`Strateji kodu üretilemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    }
  }

  // Trading Assistant için genel yanıt üretme metodu
  async generateResponse(systemPrompt: string, userPrompt: string, provider?: 'openai' | 'anthropic'): Promise<string> {
    if (!this.settings) {
      throw new Error('AI servisleri yapılandırılmamış. Lütfen API anahtarlarını ayarlayın.')
    }

    // Auto-select provider if not specified
    if (!provider) {
      if (this.settings.openai?.enabled === true && this.settings.openai?.apiKey) {
        provider = 'openai'
      } else if (this.settings.anthropic?.enabled === true && this.settings.anthropic?.apiKey) {
        provider = 'anthropic'
      } else {
        throw new Error('Hiçbir AI servisi etkin değil. Lütfen en az birini etkinleştirin.')
      }
    }

    const config = provider === 'openai' ? this.settings.openai : this.settings.anthropic

    if (!config?.enabled || !config?.apiKey) {
      throw new Error(`${provider} servisi etkin değil veya API anahtarı eksik.`)
    }

    try {
      if (provider === 'openai') {
        return await this.callOpenAIWithSystem(systemPrompt, userPrompt, config.model, config.apiKey)
      } else {
        return await this.callAnthropicWithSystem(systemPrompt, userPrompt, config.model, config.apiKey)
      }
    } catch (error) {
      console.error(`AI yanıt üretimi hatası (${provider}):`, error)
      throw new Error(`AI yanıtı üretilemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    }
  }

  private async callOpenAIWithSystem(systemPrompt: string, userPrompt: string, model: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'API çağrısı başarısız' } }))
      throw new Error(error.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Yanıt alınamadı'
  }

  private async callAnthropicWithSystem(systemPrompt: string, userPrompt: string, model: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'API çağrısı başarısız' } }))
      throw new Error(error.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.content[0]?.text || 'Yanıt alınamadı'
  }
}

export const aiService = AIService.getInstance()