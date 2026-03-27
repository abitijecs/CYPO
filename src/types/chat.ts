export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: Date
}

export interface PaymentReadyEvent {
  serviceId?: string
  clientName?: string
  triggered: boolean
}
