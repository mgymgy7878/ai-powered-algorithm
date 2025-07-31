import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeSlash, Gear, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { aiService, AIConfig } from '@/lib/ai-service'

interface AIConfigurationProps {
  onClose?: () => void
}

export function AIConfiguration({ onClose }: AIConfigurationProps) {
  const [config, setConfig] = useState<AIConfig>({
    preferredModel: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000
  })
  const [showOpenAIKey, setShowOpenAIKey] = useState(false)
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<{[key: string]: 'success' | 'error' | 'testing'}>({})

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const currentConfig = aiService.getConfig()
      setConfig(currentConfig)
    } catch (error) {
      console.error('Konfigürasyon yüklenirken hata:', error)
    }
  }

  const handleConfigChange = (key: keyof AIConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const saveConfig = async () => {
    setIsLoading(true)
    try {
      await aiService.updateConfig(config)
      toast.success('AI konfigürasyonu kaydedildi')
      onClose?.()
    } catch (error) {
      toast.error('Konfigürasyon kaydedilirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const testAPIKey = async (provider: 'openai' | 'anthropic') => {
    setTestResults(prev => ({ ...prev, [provider]: 'testing' }))
    
    try {
      // Create a temporary service with current config
      await aiService.updateConfig(config)
      
      const testMessage = 'Merhaba, bu bir test mesajıdır.'
      const result = await aiService.generalQuestion(testMessage)
      
      if (result.content) {
        setTestResults(prev => ({ ...prev, [provider]: 'success' }))
        toast.success(`${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API anahtarı başarıyla test edildi`)
      } else {
        throw new Error('Boş yanıt alındı')
      }
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, [provider]: 'error' }))
      toast.error(`${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API test hatası: ${error.message}`)
    }
  }

  const getModelOptions = () => {
    const options = []
    
    if (config.openaiApiKey) {
      options.push(
        { value: 'gpt-4', label: 'GPT-4 (En Güçlü)' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Hızlı)' }
      )
    }
    
    if (config.anthropicApiKey) {
      options.push(
        { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet (Dengeli)' },
        { value: 'claude-3-haiku', label: 'Claude 3 Haiku (Hızlı)' }
      )
    }
    
    return options
  }

  const getStatusBadge = (provider: 'openai' | 'anthropic') => {
    const status = testResults[provider]
    
    switch (status) {
      case 'testing':
        return <Badge variant="secondary" className="animate-pulse">Test ediliyor...</Badge>
      case 'success':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Çalışıyor</Badge>
      case 'error':
        return <Badge variant="destructive"><Warning className="w-3 h-3 mr-1" />Hata</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Gear className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Konfigürasyonu</h2>
      </div>

      {/* OpenAI Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                OpenAI API
                {getStatusBadge('openai')}
              </CardTitle>
              <CardDescription>
                GPT-4 ve GPT-3.5 Turbo modellerine erişim için OpenAI API anahtarı
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">API Anahtarı</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="openai-key"
                  type={showOpenAIKey ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={config.openaiApiKey || ''}
                  onChange={(e) => handleConfigChange('openaiApiKey', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                >
                  {showOpenAIKey ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => testAPIKey('openai')}
                disabled={!config.openaiApiKey || testResults.openai === 'testing'}
              >
                Test Et
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              API anahtarınızı <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI hesabınızdan</a> alabilirsiniz
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Anthropic Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Anthropic API
                {getStatusBadge('anthropic')}
              </CardTitle>
              <CardDescription>
                Claude 3 modellerine erişim için Anthropic API anahtarı
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="anthropic-key">API Anahtarı</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="anthropic-key"
                  type={showAnthropicKey ? 'text' : 'password'}
                  placeholder="sk-ant-..."
                  value={config.anthropicApiKey || ''}
                  onChange={(e) => handleConfigChange('anthropicApiKey', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                >
                  {showAnthropicKey ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => testAPIKey('anthropic')}
                disabled={!config.anthropicApiKey || testResults.anthropic === 'testing'}
              >
                Test Et
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              API anahtarınızı <a href="https://console.anthropic.com/account/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anthropic hesabınızdan</a> alabilirsiniz
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Model Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Model Ayarları</CardTitle>
          <CardDescription>
            AI modeli ve yanıt parametrelerini yapılandırın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model-select">Tercih Edilen Model</Label>
            <Select
              value={config.preferredModel}
              onValueChange={(value) => handleConfigChange('preferredModel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Model seçin" />
              </SelectTrigger>
              <SelectContent>
                {getModelOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                {getModelOptions().length === 0 && (
                  <SelectItem value="" disabled>
                    Önce API anahtarı ekleyin
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Yaratıcılık (Temperature)</Label>
              <Badge variant="outline">{config.temperature}</Badge>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[config.temperature]}
              onValueChange={([value]) => handleConfigChange('temperature', value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Düşük değerler daha tutarlı, yüksek değerler daha yaratıcı yanıtlar verir
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-tokens">Maksimum Token</Label>
              <Badge variant="outline">{config.maxTokens}</Badge>
            </div>
            <Slider
              id="max-tokens"
              min={500}
              max={4000}
              step={100}
              value={[config.maxTokens]}
              onValueChange={([value]) => handleConfigChange('maxTokens', value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              AI yanıtının maksimum uzunluğu (1 token ≈ 0.75 kelime)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Usage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Önemli Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Warning className="w-4 h-4 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <strong>Güvenlik:</strong> API anahtarları güvenli şekilde tarayıcınızda saklanır ve başka yere gönderilmez.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Warning className="w-4 h-4 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <strong>Maliyet:</strong> Her AI çağrısı API sağlayıcınıza ücret getirir. Kullanım limitlerini kontrol edin.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
            <div className="text-sm">
              <strong>Önerilen:</strong> GPT-4 daha kaliteli kod üretir, GPT-3.5 daha hızlı ve ekonomiktir.
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Ayarlar otomatik olarak kaydedilir ve tüm AI özellikleri için kullanılır
        </div>
        <div className="flex gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Kapat
            </Button>
          )}
          <Button onClick={saveConfig} disabled={isLoading}>
            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>
    </div>
  )
}