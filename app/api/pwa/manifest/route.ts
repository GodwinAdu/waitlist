import { NextResponse } from "next/server"

export async function GET() {
  const manifest = {
    name: "Waitlist Platform",
    short_name: "Waitlist",
    description: "Advanced SaaS Waitlist Management Platform",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f23",
    theme_color: "#8b5cf6",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    categories: ["business", "productivity"],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow"
      }
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "Go to admin dashboard",
        url: "/admin",
        icons: [{ src: "/shortcut-dashboard.png", sizes: "96x96" }]
      },
      {
        name: "New Project",
        short_name: "New Project",
        description: "Create new project",
        url: "/admin/projects/new",
        icons: [{ src: "/shortcut-new.png", sizes: "96x96" }]
      }
    ]
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=31536000'
    }
  })
}