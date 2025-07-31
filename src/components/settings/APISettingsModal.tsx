import { useState, useCallback } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { AlertCircle, CheckCircle, Key, Settings, TestTube } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { APISettings } from '../../types/api'
import { aiService } from '../../services/aiService'
import { toast } from 'sonner'

export function APISettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

  const [testingOpenAI, setTestingOpenAI] = useState(false)
  const [testingAnthropic, setTestingAnthropic] = useState(false)
  const [openAIStatus, setOpenAIStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [anthropicStatus, setAnthropicStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const updateSettings = useCallback((newSettings: APISettings) => {
    setSettings(newSettings)
    aiService.setSettings(newSettings)
  }, [setSettings])

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <CardTitle>AI API Ayarları</CardTitle>
          </div>
          <CardDescription>
            OpenAI ve Anthropic API anahtarlarınızı yapılandırarak AI destekli kod üretimini etkinleştirin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OpenAI Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                <h3 className="text-lg font-semibold">OpenAI</h3>
                {openAIStatus === 'success' && <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Doğrulandı</Badge>}
                {openAIStatus === 'error' && <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Hata</Badge>}
              </div>
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

            <div className="grid gap-4">
              <div>
                <Label htmlFor="openai-key">API Anahtarı</Label>
                <div className="flex gap-2">
                  <Input
                    id="openai-key"
                    type="password"
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
          </div>

          {/* Anthropic Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                <h3 className="text-lg font-semibold">Anthropic (Claude)</h3>
                {anthropicStatus === 'success' && <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Doğrulandı</Badge>}
                {anthropicStatus === 'error' && <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Hata</Badge>}
              </div>
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

            <div className="grid gap-4">
              <div>
                <Label htmlFor="anthropic-key">API Anahtarı</Label>
                <div className="flex gap-2">
                  <Input
                    id="anthropic-key"
                    type="password"
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
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button onClick={() => {
              toast.success('API ayarları kaydedildi')
              onClose()
            }}>
              Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}