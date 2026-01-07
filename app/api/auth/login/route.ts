import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Admin from "@/models/Admin"
import { comparePassword, generateToken } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import { validateRequired, validateEmail, sanitizeInput } from "@/lib/validation"

const loginRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 })

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await loginRateLimit(request as any)
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json()
    const username = sanitizeInput(body.username || '')
    const password = body.password || ''

    // Validation
    const requiredErrors = validateRequired({ username, password })
    if (requiredErrors.length > 0) {
      return NextResponse.json({ error: requiredErrors[0] }, { status: 400 })
    }

    await connectToDB()

    // Find admin
    const admin = await Admin.findOne({ username }).select('+password')

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Compare password
    const isValidPassword = await comparePassword(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate token
    const token = generateToken({
      userId: admin._id.toString(),
      username: admin.username,
      email: admin.email,
    })

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    })

    // Set cookie on response
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
