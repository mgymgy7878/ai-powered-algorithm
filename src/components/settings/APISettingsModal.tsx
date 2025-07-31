import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { APISettings } from './APISettings'

interface APISettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function APISettingsModal({ isOpen, onClose }: APISettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>API Ayarları ve Test</DialogTitle>
        </DialogHeader>
        <APISettings />
      </DialogContent>
    </Dialog>
  )
}