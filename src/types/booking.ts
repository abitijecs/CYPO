export type ServiceCategory = 'visage' | 'corps' | 'maquillage' | 'soins'

export interface Service {
  id: string
  name: string
  description: string
  duration: number // minutes
  price: number // EUR
  category: ServiceCategory
  popular?: boolean
}

export interface TimeSlot {
  time: string // "HH:MM"
  available: boolean
}

export interface BookingFormData {
  serviceId: string
  date: string // "YYYY-MM-DD"
  time: string // "HH:MM"
  firstName: string
  lastName: string
  email: string
  phone: string
  notes?: string
}

export interface BookingSubmission extends BookingFormData {
  id: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'cancelled'
}
