import { useEffect, useRef, memo } from 'react'
import { createChart, ColorType, LineStyle, CrosshairMode } from 'lightweight-charts'
import type { IChartApi, ISeriesApi, UTCTimestamp, LineData, CandlestickData } from 'lightweight-charts'

export interface TradeSignal {
  time: UTCTimestamp
  type: 'buy' | 'sell'
  price: number
  id: string
}

export interface ChartData {
  candlesticks: CandlestickData[]
  signals?: TradeSignal[]
  volume?: Array<{ time: UTCTimestamp; value: number; color?: string }>
}

interface TradingChartProps {
  data: ChartData
  width?: number
  height?: number
  symbol?: string
  timeframe?: string
  onSignalClick?: (signal: TradeSignal) => void
}

export const TradingChart = memo(function TradingChart({ 
  data, 
  width = 800, 
  height = 400, 
  symbol = 'BTCUSDT',
  timeframe = '1h',
  onSignalClick 
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  const buySignalsRef = useRef<ISeriesApi<'Line'> | null>(null)
  const sellSignalsRef = useRef<ISeriesApi<'Line'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Grafik oluşturma
    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#cccccc',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: '#cccccc',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    chartRef.current = chart

    // Mum grafik serisi ekleme
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })
    candlestickSeriesRef.current = candlestickSeries

    // Hacim serisi ekleme
    if (data.volume && data.volume.length > 0) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      })
      volumeSeriesRef.current = volumeSeries
      volumeSeries.setData(data.volume)
    }

    // Alım sinyalleri için çizgi serisi
    const buySignals = chart.addLineSeries({
      color: 'transparent',
      lineWidth: 0,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    })
    buySignalsRef.current = buySignals

    // Satım sinyalleri için çizgi serisi  
    const sellSignals = chart.addLineSeries({
      color: 'transparent',
      lineWidth: 0,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    })
    sellSignalsRef.current = sellSignals

    return () => {
      chart.remove()
    }
  }, [width, height])

  // Veri güncellemesi
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current) return

    // Mum verilerini güncelle
    if (data.candlesticks.length > 0) {
      candlestickSeriesRef.current.setData(data.candlesticks)
    }

    // Sinyalleri güncelle
    if (data.signals && data.signals.length > 0) {
      const buyData: LineData[] = []
      const sellData: LineData[] = []

      data.signals.forEach(signal => {
        if (signal.type === 'buy') {
          buyData.push({ time: signal.time, value: signal.price })
        } else {
          sellData.push({ time: signal.time, value: signal.price })
        }
      })

      if (buySignalsRef.current) {
        buySignalsRef.current.setData(buyData)
      }
      if (sellSignalsRef.current) {
        sellSignalsRef.current.setData(sellData)
      }

      // Sinyalleri işaretleme
      data.signals.forEach(signal => {
        if (!chartRef.current) return
        
        chartRef.current.addPriceLine({
          price: signal.price,
          color: signal.type === 'buy' ? '#26a69a' : '#ef5350',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: false,
          title: `${signal.type.toUpperCase()} - ${signal.price.toFixed(2)}`,
        })
      })
    }

    // Grafik boyutunu otomatik ayarla
    chartRef.current.timeScale().fitContent()
  }, [data])

  // Sinyal tıklama olayı
  useEffect(() => {
    if (!chartRef.current || !onSignalClick) return

    const handleClick = (param: any) => {
      if (!param.time || !data.signals) return

      const clickedSignal = data.signals.find(signal => signal.time === param.time)
      if (clickedSignal) {
        onSignalClick(clickedSignal)
      }
    }

    chartRef.current.subscribeClick(handleClick)

    return () => {
      if (chartRef.current) {
        chartRef.current.unsubscribeClick(handleClick)
      }
    }
  }, [data.signals, onSignalClick])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">{symbol}</h3>
          <span className="text-sm text-muted-foreground">{timeframe}</span>
        </div>
        {data.signals && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span>Alım Sinyali ({data.signals.filter(s => s.type === 'buy').length})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span>Satım Sinyali ({data.signals.filter(s => s.type === 'sell').length})</span>
            </div>
          </div>
        )}
      </div>
      <div 
        ref={chartContainerRef} 
        className="border rounded-lg overflow-hidden bg-white"
        style={{ width: '100%', height: `${height}px` }}
      />
    </div>
  )
})