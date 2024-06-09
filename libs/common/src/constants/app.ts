export const APP = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
}

export class HeartbeatEvent {
  service: string
  timestamp: Date
}
