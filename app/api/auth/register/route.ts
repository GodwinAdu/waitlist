import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Admin from "@/models/Admin"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
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
