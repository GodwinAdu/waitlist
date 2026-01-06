import { Rocket } from "lucide-react"

export function Footer() {
    return (
        <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Rocket className="h-5 w-5 text-purple-400" />
                            <div className="absolute inset-0 h-5 w-5 bg-purple-400/20 rounded-full blur-md" />
                        </div>
                        <span className="font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            WaitlistPro
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">
                        © 2024 WaitlistPro. Built with ❤️ for creators worldwide.
                    </p>
                </div>
            </div>
        </footer>
    )
}
