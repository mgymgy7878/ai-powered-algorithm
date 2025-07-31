import { useKV } from '@github/spark/hooks'

export interface AIConfig {
  openaiApiKey?: string
  anthropicApiKey?: string
  preferredModel: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-sonnet' | 'claude-3-haiku'
  temperature: number
  maxTokens: number
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIResponse {
  content: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

class AIService {
  private config: AIConfig = {
    preferredModel: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000
  }

  constructor() {
    this.loadConfig()
  }

  private async loadConfig() {
    try {
      const savedConfig = await spark.kv.get<AIConfig>('ai-config')
      if (savedConfig) {
        this.config = { ...this.config, ...savedConfig }
      }
    } catch (error) {
      console.error('AI config yüklenirken hata:', error)
    }
  }

  async updateConfig(config: Partial<AIConfig>) {
    this.config = { ...this.config, ...config }
    await spark.kv.set('ai-config', this.config)
  }

  getConfig(): AIConfig {
    return { ...this.config }
  }

  async generateStrategyCode(request: string, currentCode?: string): Promise<AIResponse> {
    const systemPrompt = `Sen bir algoritmik trading strateji uzmanısın. Kullanıcının Türkçe isteklerini C# dilinde trading stratejisi koduna dönüştürüyorsun.

Strateji kodu şu formatı takip etmeli:
- OnStart() metodunda indikatörler tanımlanmalı
- OnBarUpdate() metodunda strateji mantığı olmalı  
- Türkçe açıklayıcı yorumlar ekle
- Risk yönetimi dahil et (stop loss, take profit)
- Pozisyon büyüklüğü kontrolü yap

Mevcut kod varsa onu iyileştir, yoksa sıfırdan oluştur.`

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `İstek: ${request}${currentCode ? `\n\nMevcut kod:\n${currentCode}` : ''}` }
    ]

    return this.callAI(messages)
  }

  async explainStrategy(code: string): Promise<AIResponse> {
    const systemPrompt = `Sen bir trading strateji uzmanısın. Verilen C# trading stratejisi kodunu Türkçe olarak detaylı açıklayacaksın.

Açıklaman şunları içersin:
- Stratejinin genel mantığı
- Kullanılan indikatörler
- Alış/satış koşulları
- Risk yönetimi yaklaşımı
- Güçlü ve zayıf yönleri`

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Bu strateji kodunu açıkla:\n\n${code}` }
    ]

    return this.callAI(messages)
  }

  async findAndFixErrors(code: string): Promise<AIResponse> {
    const systemPrompt = `Sen bir C# trading strateji kod uzmanısın. Verilen kodu analiz edip hataları ve iyileştirme önerilerini Türkçe olarak sunacaksın.

Kontrol et:
- Sözdizimi hataları
- Mantık hataları
- Risk yönetimi eksiklikleri
- Performans sorunları
- Best practice uygunluğu

Hem hataları hem de düzeltilmiş kodu ver.`

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Bu kodda hata var mı? Varsa düzelt:\n\n${code}` }
    ]

    return this.callAI(messages)
  }

  async optimizeStrategy(code: string): Promise<AIResponse> {
    const systemPrompt = `Sen bir trading optimizasyon uzmanısın. Verilen C# strateji kodunu analiz edip performans ve kârlılık optimizasyonları önereceksin.

Optimizasyon alanları:
- Indikatör parametreleri
- Risk/ödül oranları
- Trend filtreleme
- Volume analizi
- Zaman dilimi optimizasyonu
- İşlem maliyeti hesabı

Hem önerileri hem de iyileştirilmiş kodu Türkçe ver.`

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Bu stratejiyi nasıl optimize edebilirim?\n\n${code}` }
    ]

    return this.callAI(messages)
  }

  async addIndicator(code: string, indicator: string): Promise<AIResponse> {
    const systemPrompt = `Sen bir trading indikatör uzmanısın. Mevcut C# stratejisine istenen indikatörü ekleyecek ve gerekli mantığı oluşturacaksın.

Indikatör ekleme kuralları:
- OnStart() metodunda indikatörü tanımla
- OnBarUpdate() metodunda indikatör değerlerini kullan
- Parametre optimizasyonu için değişkenler ekle
- Türkçe açıklayıcı yorumlar ekle
- Mevcut strateji mantığıyla uyumlu entegrasyon`

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Bu stratejiye ${indicator} indikatörü ekle:\n\n${code}` }
    ]

    return this.callAI(messages)
  }

  async generalQuestion(question: string, context?: string): Promise<AIResponse> {
    const systemPrompt = `Sen bir algoritmik trading uzmanısın. Kullanıcının trading, strateji geliştirme ve piyasa analizi konularındaki sorularını Türkçe olarak yanıtlıyorsun.

Uzmanlık alanların:
- Teknik analiz ve indikatörler
- Risk yönetimi
- Strateji geliştirme
- Backtest analizi
- Piyasa psikolojisi
- Algoritmik trading`

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${question}${context ? `\n\nBağlam: ${context}` : ''}` }
    ]

    return this.callAI(messages)
  }

  private async callAI(messages: AIMessage[]): Promise<AIResponse> {
    const { preferredModel, temperature, maxTokens } = this.config

    if (preferredModel.startsWith('gpt')) {
      return this.callOpenAI(messages)
    } else if (preferredModel.startsWith('claude')) {
      return this.callAnthropic(messages)
    } else {
      throw new Error('Desteklenmeyen AI modeli')
    }
  }

  private async callOpenAI(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.config.openaiApiKey) {
      throw new Error('OpenAI API anahtarı bulunamadı. Lütfen ayarlardan API anahtarınızı girin.')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.openaiApiKey}`
        },
        body: JSON.stringify({
          model: this.config.preferredModel,
          messages: messages,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`OpenAI API hatası: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      
      return {
        content: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
      }
    } catch (error) {
      console.error('OpenAI API çağrısında hata:', error)
      throw error
    }
  }

  private async callAnthropic(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.config.anthropicApiKey) {
      throw new Error('Anthropic API anahtarı bulunamadı. Lütfen ayarlardan API anahtarınızı girin.')
    }

    try {
      // Convert messages format for Anthropic
      const systemMessage = messages.find(m => m.role === 'system')
      const conversationMessages = messages.filter(m => m.role !== 'system')

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.anthropicApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.preferredModel,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          system: systemMessage?.content,
          messages: conversationMessages
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Anthropic API hatası: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      
      return {
        content: data.content[0].text,
        model: data.model,
        usage: data.usage
      }
    } catch (error) {
      console.error('Anthropic API çağrısında hata:', error)
      throw error
    }
  }
}

export const aiService = new AIService()