import { toaster } from '@/components/Toaster'

type ToastTone = 'success' | 'error'

export const showProductActionToast = (message: string, tone: ToastTone) => {
  toaster.create({
    title: message,
    type: tone,
    duration: 3200,
    closable: true,
  })
}

export const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback
