"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  launchDate: Date
}

export function CountdownTimer({ launchDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(launchDate).getTime() - new Date().getTime()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [launchDate])

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className="rounded-lg bg-primary/10 p-6 text-center">
        <p className="text-xl font-semibold text-primary">We've Launched!</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm">
      <p className="mb-4 text-center text-sm font-medium text-muted-foreground">Launching in:</p>
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">{timeLeft.days}</div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">{timeLeft.hours}</div>
          <div className="text-xs text-muted-foreground">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">{timeLeft.minutes}</div>
          <div className="text-xs text-muted-foreground">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">{timeLeft.seconds}</div>
          <div className="text-xs text-muted-foreground">Seconds</div>
        </div>
      </div>
    </div>
  )
}
