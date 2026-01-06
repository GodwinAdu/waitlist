import type { Mongoose } from "mongoose"

declare global {
  var _mongoose: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }

  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string
      JWT_SECRET: string
      NEXT_PUBLIC_APP_URL: string
      SMTP_HOST?: string
      SMTP_PORT?: string
      SMTP_USER?: string
      SMTP_PASSWORD?: string
      RESEND_API_KEY?: string
      NODE_ENV: "development" | "production" | "test"
    }
  }
}
