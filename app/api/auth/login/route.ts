import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Admin from "@/models/Admin"
import { comparePassword, generateToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Validation
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    await connectToDB()

    // Find admin
    const admin = await Admin.findOne({ username })

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
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
