import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, Key, Shield, CreditCard, CheckCircle } from '@phosphor-icons/react'

export function AISetupGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI API Kurulum Rehberi</h2>
        <p className="text-muted-foreground">
          AI destekli trading özelliklerini kullanmak için API anahtarı kurulumu gereklidir.
        </p>
      </div>

      {/* OpenAI Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            OpenAI API Kurulumu
            <Badge>Önerilen</Badge>
          </CardTitle>
          <CardDescription>
            GPT-4 ve GPT-3.5 Turbo modellerine erişim için OpenAI API anahtarı
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">OpenAI hesabı oluşturun</p>
                <p className="text-sm text-muted-foreground">
                  <a 
                    href="https://platform.openai.com/signup" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    platform.openai.com/signup
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  adresinden ücretsiz hesap açın
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">API anahtarı oluşturun</p>
                <p className="text-sm text-muted-foreground">
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    API Keys
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  sayfasından "Create new secret key" butonuna tıklayın
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Kredi yükleyin</p>
                <p className="text-sm text-muted-foreground">
                  <a 
                    href="https://platform.openai.com/account/billing/overview" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Billing
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  sayfasından hesabınıza kredi yükleyin (minimum $5)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                4
              </div>
              <div>
                <p className="font-medium">API anahtarını uygulamaya girin</p>
                <p className="text-sm text-muted-foreground">
                  "AI Ayarları" butonuna tıklayıp API anahtarınızı girin ve test edin
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Maliyet Bilgisi</span>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• GPT-4: ~$0.03 per 1K token (yaklaşık 750 kelime)</p>
              <p>• GPT-3.5 Turbo: ~$0.002 per 1K token</p>
              <p>• Ortalama strateji oluşturma: $0.10 - $0.50</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anthropic Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Anthropic API Kurulumu
            <Badge variant="outline">Alternatif</Badge>
          </CardTitle>
          <CardDescription>
            Claude 3 modellerine erişim için Anthropic API anahtarı
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Anthropic hesabı oluşturun</p>
                <p className="text-sm text-muted-foreground">
                  <a 
                    href="https://console.anthropic.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    console.anthropic.com
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  adresinden hesap açın
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">API anahtarı oluşturun</p>
                <p className="text-sm text-muted-foreground">
                  <a 
                    href="https://console.anthropic.com/account/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    API Keys
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  sayfasından yeni API anahtarı oluşturun
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Kredi ekleyin</p>
                <p className="text-sm text-muted-foreground">
                  Hesap ayarlarından ödeme yöntemi ekleyin ve kredi yükleyin
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Claude Avantajları</span>
            </div>
            <div className="text-sm text-green-800 space-y-1">
              <p>• Daha büyük bağlam penceresi (100K+ token)</p>
              <p>• Uzun kodları daha iyi analiz eder</p>
              <p>• Detaylı açıklamalar ve dokümantasyon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Güvenlik ve Gizlilik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>API anahtarları sadece tarayıcınızda saklanır</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Anahtarlar sunucularımıza gönderilmez</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Tüm API çağrıları doğrudan sağlayıcıya yapılır</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>İstediğiniz zaman anahtarları silebilirsiniz</span>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Kullanım İpuçları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>Model Seçimi:</strong> GPT-4 daha kaliteli kod üretir, GPT-3.5 daha hızlı ve ekonomiktir.</p>
            <p><strong>Maliyet Kontrolü:</strong> API sağlayıcı panelinden kullanım limitleri belirleyin.</p>
            <p><strong>Test Etme:</strong> Küçük stratejilerle başlayıp büyük projelere geçin.</p>
            <p><strong>Yedekleme:</strong> Önemli stratejileri manuel olarak yedekleyin.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}