import { APISettings } from '../settings/APISettings'

interface AIConfigurationProps {
  onClose: () => void
}

export function AIConfiguration({ onClose }: AIConfigurationProps) {
  return <APISettings />
}