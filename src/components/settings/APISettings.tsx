import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Loader2, Eye, EyeOff, Settings2 } from '@phosphor-icons/react'
import { APISettings as APISettingsType } from '../../types/api'
import { aiService } from '../../services/aiService'

export function APISettings() {
  const [apiSettings, setApiSettings] = useKV<APISettingsType>('api-settings', {
    openai: {
      apiKey: '',
      model: 'gpt-4',
      enabled: true
    },
    anthropic: {
      apiKey: '',
      model: 'claude-3-sonnet',
      enabled: false
    }
  })

  const [testing, setTesting] = useState<{ openai: boolean; anthropic: boolean }>({
    openai: false,
    anthropic: false
  })

  const [testResults, setTestResults] = useState<{ openai: boolean | null; anthropic: boolean | null }>({
    openai: null,
    anthropic: null
  })

  const [showKeys, setShowKeys] = useState<{ openai: boolean; anthropic: boolean }>({
    openai: false,
    anthropic: false
  })

  const [isGeneratingTest, setIsGeneratingTest] = useState(false)

  const updateOpenAISettings = (updates: Partial<APISettingsType['openai']>) => {
    setApiSettings(prev => ({
      ...prev,
      openai: { ...prev.openai, ...updates }
    }))
  }

  const updateAnthropicSettings = (updates: Partial<APISettingsType['anthropic']>) => {
    setApiSettings(prev => ({
      ...prev,
      anthropic: { ...prev.anthropic, ...updates }
    }))
  }

  const testAPIConnection = async (provider: 'openai' | 'anthropic') => {
    const config = provider === 'openai' ? apiSettings.openai : apiSettings.anthropic
    
    if (!config.apiKey.trim()) {
      toast.error(`${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API anahtarı gerekli`)
      return
    }

    setTesting(prev => ({ ...prev, [provider]: true }))
    
    try {
      const isValid = await aiService.testConnection(provider, config.apiKey)
      setTestResults(prev => ({ ...prev, [provider]: isValid }))
      
      if (isValid) {
        toast.success(`${provider === 'openai' ? 'OpenAI' : 'Anthropic'} bağlantısı başarılı!`)
      } else {
        toast.error(`${provider === 'openai' ? 'OpenAI' : 'Anthropic'} bağlantısı başarısız. API anahtarını kontrol edin.`)
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [provider]: false }))
      toast.error(`Bağlantı testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    } finally {
      setTesting(prev => ({ ...prev, [provider]: false }))
    }
  }

  const generateTestStrategy = async () => {
    if (!aiService.isConfigured()) {
      toast.error('Lütfen önce en az bir AI servisini yapılandırın')
      return
    }

    setIsGeneratingTest(true)
    
    try {
      const prompt = "Basit bir RSI stratejisi oluştur. RSI 30'un altına düştüğünde al, 70'in üzerine çıktığında sat sinyali versin. Türkçe açıklamalarla C# kodu yaz."
      
      const provider = apiSettings.openai.enabled && apiSettings.openai.apiKey ? 'openai' : 'anthropic'
      const code = await aiService.generateStrategy(prompt, provider)
      
      console.log('Üretilen test stratejisi:', code)
      toast.success('Test stratejisi başarıyla üretildi! Konsolu kontrol edin.')
    } catch (error) {
      console.error('Strateji üretim hatası:', error)
      toast.error(`Strateji üretimi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    } finally {
      setIsGeneratingTest(false)
    }
  }

  const getConnectionStatus = (provider: 'openai' | 'anthropic') => {
    const result = testResults[provider]
    if (result === null) return null
    return result
  }

  const renderConnectionBadge = (provider: 'openai' | 'anthropic') => {
    const status = getConnectionStatus(provider)
    const isTesting = testing[provider]
    
    if (isTesting) {
      return <Badge variant="outline" className="flex items-center gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        Test ediliyor...
      </Badge>
    }
    
    if (status === true) {
      return <Badge variant="default" className="flex items-center gap-1 bg-green-500">
        <CheckCircle className="w-3 h-3" />
        Bağlı
      </Badge>
    }
    
    if (status === false) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        Bağlantı Hatası
      </Badge>
    }
    
    return <Badge variant="outline">Test edilmedi</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5" />
        <h2 className="text-xl font-semibold">API Ayarları</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* OpenAI Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  OpenAI GPT
                  {renderConnectionBadge('openai')}
                </CardTitle>
                <CardDescription>
                  GPT-4 ve GPT-3.5 modelleri için OpenAI API ayarları
                </CardDescription>
              </div>
              <Switch
                checked={apiSettings.openai.enabled}
                onCheckedChange={(enabled) => updateOpenAISettings({ enabled })}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">API Anahtarı</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="openai-key"
                    type={showKeys.openai ? "text" : "password"}
                    placeholder="sk-..."
                    value={apiSettings.openai.apiKey}
                    onChange={(e) => updateOpenAISettings({ apiKey: e.target.value })}
                    disabled={!apiSettings.openai.enabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowKeys(prev => ({ ...prev, openai: !prev.openai }))}
                  >
                    {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="openai-model">Model</Label>
              <Select
                value={apiSettings.openai.model}
                onValueChange={(value) => updateOpenAISettings({ model: value as APISettingsType['openai']['model'] })}
                disabled={!apiSettings.openai.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (En İyi Kalite)</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Hızlı)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Ekonomik)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={() => testAPIConnection('openai')}
              disabled={!apiSettings.openai.enabled || !apiSettings.openai.apiKey.trim() || testing.openai}
              className="w-full"
              variant="outline"
            >
              {testing.openai ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Test Ediliyor...
                </>
              ) : (
                'Bağlantıyı Test Et'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Anthropic Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Anthropic Claude
                  {renderConnectionBadge('anthropic')}
                </CardTitle>
                <CardDescription>
                  Claude 3 modelleri için Anthropic API ayarları
                </CardDescription>
              </div>
              <Switch
                checked={apiSettings.anthropic.enabled}
                onCheckedChange={(enabled) => updateAnthropicSettings({ enabled })}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="anthropic-key">API Anahtarı</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="anthropic-key"
                    type={showKeys.anthropic ? "text" : "password"}
                    placeholder="sk-ant-..."
                    value={apiSettings.anthropic.apiKey}
                    onChange={(e) => updateAnthropicSettings({ apiKey: e.target.value })}
                    disabled={!apiSettings.anthropic.enabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowKeys(prev => ({ ...prev, anthropic: !prev.anthropic }))}
                  >
                    {showKeys.anthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="anthropic-model">Model</Label>
              <Select
                value={apiSettings.anthropic.model}
                onValueChange={(value) => updateAnthropicSettings({ model: value as APISettingsType['anthropic']['model'] })}
                disabled={!apiSettings.anthropic.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-3-opus">Claude 3 Opus (En İyi)</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet (Dengeli)</SelectItem>
                  <SelectItem value="claude-3-haiku">Claude 3 Haiku (Hızlı)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={() => testAPIConnection('anthropic')}
              disabled={!apiSettings.anthropic.enabled || !apiSettings.anthropic.apiKey.trim() || testing.anthropic}
              className="w-full"
              variant="outline"
            >
              {testing.anthropic ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Test Ediliyor...
                </>
              ) : (
                'Bağlantıyı Test Et'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Test Code Generation */}
      <Card>
        <CardHeader>
          <CardTitle>AI Kod Üretimini Test Et</CardTitle>
          <CardDescription>
            API bağlantılarınızı test ettikten sonra AI destekli kod üretimini deneyebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={generateTestStrategy}
            disabled={!aiService.isConfigured() || isGeneratingTest}
            className="w-full"
            size="lg"
          >
            {isGeneratingTest ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Test Stratejisi Üretiliyor...
              </>
            ) : (
              'Test Stratejisi Üret'
            )}
          </Button>
          
          {!aiService.isConfigured() && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Test etmek için en az bir AI servisinin API anahtarını girin ve etkinleştirin
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium">API Anahtarları Nereden Alınır?</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>OpenAI:</strong> <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></p>
              <p><strong>Anthropic:</strong> <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="underline">console.anthropic.com/settings/keys</a></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}