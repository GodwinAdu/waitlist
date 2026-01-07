type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry
    
    let logString = `[${timestamp}] ${level.toUpperCase()}: ${message}`
    
    if (context && Object.keys(context).length > 0) {
      logString += ` | Context: ${JSON.stringify(context)}`
    }
    
    if (error) {
      logString += ` | Error: ${error.message}`
      if (error.stack) {
        logString += ` | Stack: ${error.stack}`
      }
    }
    
    return logString
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    }

    const formattedLog = this.formatLog(entry)
    
    switch (level) {
      case 'error':
        console.error(formattedLog)
        break
      case 'warn':
        console.warn(formattedLog)
        break
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(formattedLog)
        }
        break
      default:
        console.log(formattedLog)
    }

    // In production, you might want to send logs to external service
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      // Send to monitoring service like Sentry, LogRocket, etc.
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error)
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context)
  }
}

export const logger = new Logger()

// Helper function for API error logging
export function logApiError(endpoint: string, error: Error, context?: Record<string, any>) {
  logger.error(`API Error in ${endpoint}`, error, {
    endpoint,
    ...context
  })
}