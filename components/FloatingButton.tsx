"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-8 left-8 z-50 p-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all active:scale-90"
    >
      {theme === "dark" ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-600" />}
    </button>
  )
}