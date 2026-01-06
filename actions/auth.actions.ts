"use server"

import { connectToDB } from "@/lib/mongoose"
import Admin from "@/models/Admin"
import { comparePassword, generateToken, hashPassword } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LoginSchema, RegisterSchema } from "@/lib/validations"

export async function loginAction(formData: FormData) {
  let isSuccess = false;

  try {
    const rawData = {
      username: formData.get("username"),
      password: formData.get("password"),
    }

    const validatedFields = LoginSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors }
    }

    const { username, password } = validatedFields.data

    await connectToDB()

    const admin = await Admin.findOne({ username })
    if (!admin) {
      return { error: "Invalid credentials" }
    }

    const isValidPassword = await comparePassword(password, admin.password)
    if (!isValidPassword) {
      return { error: "Invalid credentials" }
    }

    const token = generateToken({
      userId: admin._id.toString(),
      username: admin.username,
      email: admin.email,
    })

    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    isSuccess = true;
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Login failed" }
  }

  if (isSuccess) {
    redirect("/admin")
  }
}

export async function registerAction(formData: FormData) {
  let isSuccess = false;

  try {
    const rawData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      secretKey: formData.get("secretKey"),
    }

    const validatedFields = RegisterSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors }
    }

    const { username, email, password, secretKey } = validatedFields.data

    // Security Check: Verify Admin Secret Key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return { error: "Invalid admin secret key" }
    }

    await connectToDB()

    const existingUser = await Admin.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      return { error: "Username or email already exists" }
    }

    const hashedPassword = await hashPassword(password)

    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    })

    const token = generateToken({
      userId: admin._id.toString(),
      username: admin.username,
      email: admin.email,
    })

    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    isSuccess = true;
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Registration failed" }
  }

  if (isSuccess) {
    redirect("/admin")
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
  redirect("/login")
}