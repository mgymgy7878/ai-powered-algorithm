import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Eye, EyeSlash, CheckCircle, AlertTriangle, Key, TestTube, Settings } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { aiService } from '../../services/aiService'
import { useKV } from '@github/spark/hooks'
import { APISettings } from '../../types/api'

interface AIConfigurationProps {
  onClose?: () => void
}

export function AIConfiguration({ onClose }: AIConfigurationProps) {
  const [settings, setSettings] = useKV<APISettings>('api-settings', {
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

  const [showOpenAIKey, setShowOpenAIKey] = useState(false)
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)
  const [testingOpenAI, setTestingOpenAI] = useState(false)
  const [testingAnthropic, setTestingAnthropic] = useState(false)
  const [openAIStatus, setOpenAIStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [anthropicStatus, setAnthropicStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const updateSettings = (newSettings: APISettings) => {
    setSettings(newSettings)
    aiService.setSettings(newSettings)
  }

  const testOpenAI = async () => {
    if (!settings.openai.apiKey) {
      toast.error('OpenAI API anahtarı girilmelidir')
      return
    }

    setTestingOpenAI(true)
    setOpenAIStatus('idle')

    try {
      const isValid = await aiService.testConnection('openai', settings.openai.apiKey)
      if (isValid) {
        setOpenAIStatus('success')
        toast.success('OpenAI API anahtarı başarıyla doğrulandı')
      } else {
        setOpenAIStatus('error')
        toast.error('OpenAI API anahtarı geçersiz')
      }
    } catch (error) {
      setOpenAIStatus('error')
      toast.error('OpenAI bağlantı testi başarısız')
    } finally {
      setTestingOpenAI(false)
    }
  }

  const testAnthropic = async () => {
    if (!settings.anthropic.apiKey) {
      toast.error('Anthropic API anahtarı girilmelidir')
      return
    }

    setTestingAnthropic(true)
    setAnthropicStatus('idle')

    try {
      const isValid = await aiService.testConnection('anthropic', settings.anthropic.apiKey)
      if (isValid) {
        setAnthropicStatus('success')
        toast.success('Anthropic API anahtarı başarıyla doğrulandı')
      } else {
        setAnthropicStatus('error')
        toast.error('Anthropic API anahtarı geçersiz')
      }
    } catch (error) {
      setAnthropicStatus('error')
      toast.error('Anthropic bağlantı testi başarısız')
    } finally {
      setTestingAnthropic(false)
    }
  }

  const getStatusBadge = (status: 'idle' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Doğrulandı
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Hata
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">AI Konfigürasyonu</h2>
          <p className="text-sm text-muted-foreground">
            Trading stratejileri için AI modellerini yapılandırın
          </p>
        </div>
      </div>

      {/* OpenAI Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              <div>
                <CardTitle>OpenAI API</CardTitle>
                <CardDescription>
                  GPT-4 ve GPT-3.5 Turbo modellerine erişim
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(openAIStatus)}
              <Switch
                checked={settings.openai.enabled}
                onCheckedChange={(enabled) => 
                  updateSettings({
                    ...settings,
                    openai: { ...settings.openai, enabled }
                  })
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="openai-key">API Anahtarı</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="openai-key"
                    type={showOpenAIKey ? 'text' : 'password'}
                    placeholder="sk-..."
                    value={settings.openai.apiKey}
                    onChange={(e) => 
                      updateSettings({
                        ...settings,
                        openai: { ...settings.openai, apiKey: e.target.value }
                      })
                    }
                    disabled={!settings.openai.enabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                    disabled={!settings.openai.enabled}
                  >
                    {showOpenAIKey ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testOpenAI}
                  disabled={!settings.openai.enabled || !settings.openai.apiKey || testingOpenAI}
                >
                  <TestTube className="w-4 h-4 mr-1" />
                  {testingOpenAI ? 'Test ediliyor...' : 'Test Et'}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="openai-model">Model</Label>
              <Select
                value={settings.openai.model}
                onValueChange={(model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo') =>
                  updateSettings({
                    ...settings,
                    openai: { ...settings.openai, model }
                  })
                }
                disabled={!settings.openai.enabled}
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
          </div>
        </CardContent>
      </Card>

      {/* Anthropic Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              <div>
                <CardTitle>Anthropic (Claude)</CardTitle>
                <CardDescription>
                  Claude 3 model ailesi erişimi
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(anthropicStatus)}
              <Switch
                checked={settings.anthropic.enabled}
                onCheckedChange={(enabled) => 
                  updateSettings({
                    ...settings,
                    anthropic: { ...settings.anthropic, enabled }
                  })
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="anthropic-key">API Anahtarı</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="anthropic-key"
                    type={showAnthropicKey ? 'text' : 'password'}
                    placeholder="sk-ant-..."
                    value={settings.anthropic.apiKey}
                    onChange={(e) => 
                      updateSettings({
                        ...settings,
                        anthropic: { ...settings.anthropic, apiKey: e.target.value }
                      })
                    }
                    disabled={!settings.anthropic.enabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                    disabled={!settings.anthropic.enabled}
                  >
                    {showAnthropicKey ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testAnthropic}
                  disabled={!settings.anthropic.enabled || !settings.anthropic.apiKey || testingAnthropic}
                >
                  <TestTube className="w-4 h-4 mr-1" />
                  {testingAnthropic ? 'Test ediliyor...' : 'Test Et'}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="anthropic-model">Model</Label>
              <Select
                value={settings.anthropic.model}
                onValueChange={(model: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku') =>
                  updateSettings({
                    ...settings,
                    anthropic: { ...settings.anthropic, model }
                  })
                }
                disabled={!settings.anthropic.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-3-opus">Claude 3 Opus (En İyi Kalite)</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet (Dengeli)</SelectItem>
                  <SelectItem value="claude-3-haiku">Claude 3 Haiku (Hızlı)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Yapılandırma Durumu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>OpenAI API</span>
              <div className="flex items-center gap-2">
                {settings.openai.enabled && settings.openai.apiKey ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Yapılandırıldı
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Yapılandırılmadı
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Anthropic API</span>
              <div className="flex items-center gap-2">
                {settings.anthropic.enabled && settings.anthropic.apiKey ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Yapılandırıldı
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Yapılandırılmadı
                  </Badge>
                )}
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground">
                {aiService.isConfigured() ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    AI servisleri kullanıma hazır
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    En az bir API anahtarı gereklidir
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Kapat
        </Button>
        <Button onClick={() => {
          toast.success('Ayarlar kaydedildi')
          onClose?.()
        }}>
          Kaydet
        </Button>
      </div>
    </div>
  )
}