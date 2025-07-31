import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { 
  Brain, Lightning, Target, BarChart3, CheckCircle, AlertTriangle, 
  CircleNotch, Sparkle, Trophy, Gauge, Code, Settings
} from '@phosphor-icons/react'

interface AlgorithmIndicatorProps {
  isActive: boolean
  progress: number
  currentStep: string
  model: string
  strategyName?: string
  onStop?: () => void
}

export function AlgorithmIndicator({ 
  isActive, 
  progress, 
  currentStep, 
  model, 
  strategyName,
  onStop 
}: AlgorithmIndicatorProps) {
  if (!isActive && progress === 0) return null

  const getStepIcon = (step: string) => {
    if (step.includes('analiz')) return <Brain className="h-4 w-4" />
    if (step.includes('kod')) return <Code className="h-4 w-4" />
    if (step.includes('test')) return <BarChart3 className="h-4 w-4" />
    if (step.includes('optimize') || step.includes('optimiz')) return <Target className="h-4 w-4" />
    if (step.includes('puan')) return <Trophy className="h-4 w-4" />
    return <Settings className="h-4 w-4" />
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-primary'
    if (progress < 70) return 'bg-accent'
    return 'bg-primary'
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="relative">
              <Sparkle className="h-5 w-5 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            MatrixIQ Algorithm Engine
          </CardTitle>
          {onStop && (
            <Button variant="outline" size="sm" onClick={onStop}>
              Durdur
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Lightning className="h-3 w-3" />
            {model === 'gpt-4o' ? 'Professional' : 'Turbo'} Mode
          </Badge>
          {strategyName && (
            <Badge variant="outline">
              {strategyName}
            </Badge>
          )}
          <Badge className="bg-accent text-accent-foreground">
            {isActive ? 'Aktif' : 'Tamamlandı'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Step */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            {isActive ? (
              <CircleNotch className="h-4 w-4 animate-spin text-primary" />
            ) : progress === 100 ? (
              <CheckCircle className="h-4 w-4 text-accent" />
            ) : (
              getStepIcon(currentStep)
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {isActive ? 'Şu an çalışıyor:' : progress === 100 ? 'İşlem tamamlandı!' : 'Son adım:'}
            </p>
            <p className="text-sm text-muted-foreground">{currentStep}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>İlerleme</span>
            <span className="font-mono font-bold">{progress}%</span>
          </div>
          <Progress 
            value={progress} 
            className={`h-3 ${getProgressColor(progress)}`}
          />
        </div>

        {/* Phase Indicators */}
        <div className="grid grid-cols-5 gap-2 text-xs">
          <div className={`flex flex-col items-center p-2 rounded ${
            progress > 10 ? 'bg-accent/20 text-accent' : 'text-muted-foreground'
          }`}>
            <Brain className="h-4 w-4 mb-1" />
            <span>Analiz</span>
          </div>
          <div className={`flex flex-col items-center p-2 rounded ${
            progress > 30 ? 'bg-accent/20 text-accent' : 'text-muted-foreground'
          }`}>
            <Code className="h-4 w-4 mb-1" />
            <span>Kod</span>
          </div>
          <div className={`flex flex-col items-center p-2 rounded ${
            progress > 50 ? 'bg-accent/20 text-accent' : 'text-muted-foreground'
          }`}>
            <BarChart3 className="h-4 w-4 mb-1" />
            <span>Test</span>
          </div>
          <div className={`flex flex-col items-center p-2 rounded ${
            progress > 80 ? 'bg-accent/20 text-accent' : 'text-muted-foreground'
          }`}>
            <Target className="h-4 w-4 mb-1" />
            <span>Optimize</span>
          </div>
          <div className={`flex flex-col items-center p-2 rounded ${
            progress > 95 ? 'bg-accent/20 text-accent' : 'text-muted-foreground'
          }`}>
            <Trophy className="h-4 w-4 mb-1" />
            <span>Puan</span>
          </div>
        </div>

        {/* Status Message */}
        {progress === 100 && (
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                ✨ MatrixIQ algoritması başarıyla tamamlandı!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}