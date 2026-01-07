import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Admin from "@/models/Admin"
import { hashPassword, generateToken } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import { validateRequired, validateEmail, validatePassword, sanitizeInput } from "@/lib/validation"

const registerRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 3 })

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await registerRateLimit(request as any)
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json()
    const username = sanitizeInput(body.username || '')
    const email = sanitizeInput(body.email || '').toLowerCase()
    const password = body.password || ''

    // Validation
    const requiredErrors = validateRequired({ username, email, password })
    if (requiredErrors.length > 0) {
      return NextResponse.json({ error: requiredErrors[0] }, { status: 400 })
    }

    const emailErrors = validateEmail(email)
    if (emailErrors.length > 0) {
      return NextResponse.json({ error: emailErrors[0] }, { status: 400 })
    }

    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      return NextResponse.json({ error: passwordErrors[0] }, { status: 400 })
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: "Username must be 3-20 characters" }, { status: 400 })
    }

    await connectToDB()

    // Check if user already exists
    const existingUser = await Admin.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new admin
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    })

    // Generate token
    const token = generateToken({
      userId: admin._id.toString(),
      username: admin.username,
      email: admin.email,
    })

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
        },
      },
      { status: 201 },
    )

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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
