'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

let toastId = 0
const toasts: Toast[] = []
const listeners: ((toasts: Toast[]) => void)[] = []

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
}

function addToast(message: string, type: Toast['type']) {
  const id = (++toastId).toString()
  const newToast = { id, message, type }
  toasts.push(newToast)
  listeners.forEach(listener => listener([...toasts]))
  
  setTimeout(() => removeToast(id), 3000)
}

function removeToast(id: string) {
  const index = toasts.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.splice(index, 1)
    listeners.forEach(listener => listener([...toasts]))
  }
}

export function Toaster() {
  const [toastList, setToastList] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setToastList)
    return () => {
      const index = listeners.indexOf(setToastList)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm animate-in slide-in-from-right-full ${
            toast.type === 'success' 
              ? 'border-green-500/50 bg-green-500/10 text-green-200' 
              : toast.type === 'error'
              ? 'border-red-500/50 bg-red-500/10 text-red-200'
              : 'border-blue-500/50 bg-blue-500/10 text-blue-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-400" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-400" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-blue-400" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-auto text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}