export type Notification = {
  id: string
  message: string
  time?: string
  type?: 'info' | 'success' | 'warning' | 'error'
  icon?: string
}

export type NotificationCenterProps = {
  className?: string
}