import React, { useState } from 'react'
import TradingViewWidget from '../chart/TradingViewWidget'

const ChartModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  symbol: string
}> = ({ isOpen, onClose, symbol }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-4">
        <TradingViewWidget
          symbol={symbol}
          isFullscreen={true}
          onFullscreenToggle={onClose}
        />
      </div>
    </div>
  )
}

export default ChartModal