"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import GradientButton from "../GradientButton"
import { Home, RefreshCw, Zap } from "lucide-react"
import confetti from "canvas-confetti"

export default function FireworksScreen({ onNext }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [fireworks, setFireworks] = useState([])
  const [particles, setParticles] = useState([])
  const [autoLaunch, setAutoLaunch] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle class
    class Particle {
      constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
        this.size = Math.random() * 2 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.life = 100
        this.gravity = 0.05
        this.friction = 0.99
        this.alpha = 1
      }

      update() {
        this.speedX *= this.friction
        this.speedY *= this.friction
        this.speedY += this.gravity
        this.x += this.speedX
        this.y += this.speedY
        this.life--
        this.alpha = this.life / 100
      }

      draw(ctx) {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // Firework class
    class Firework {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`
        this.particles = []
        this.createParticles()
      }

      createParticles() {
        const particleCount = 150
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = Math.random() * 6 + 2
          const particle = {
            x: this.x,
            y: this.y,
            color: this.color,
            size: Math.random() * 4 + 1,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            life: 100,
            gravity: 0.1,
            friction: 0.97,
            alpha: 1
          }
          this.particles.push(particle)
        }
      }

      update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i]
          
          p.speedX *= p.friction
          p.speedY *= p.friction
          p.speedY += p.gravity
          p.x += p.speedX
          p.y += p.speedY
          p.life--
          p.alpha = p.life / 100

          if (p.life <= 0) {
            this.particles.splice(i, 1)
          }
        }
      }

      draw(ctx) {
        this.particles.forEach(p => {
          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          
          // Add glow effect
          ctx.shadowColor = p.color
          ctx.shadowBlur = 15
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })
      }

      isDone() {
        return this.particles.length === 0
      }
    }

    let fireworksArray = []
    let particlesArray = []

    // Create random firework
    const createRandomFirework = () => {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height * 0.5
      fireworksArray.push(new Firework(x, y))
      
      // Also launch confetti
      if (Math.random() > 0.5) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { x: x / canvas.width, y: y / canvas.height },
          colors: ['#FF3CAC', '#F687B3', '#D8B4FE', '#C084FC'],
        })
      }
    }

    // Create firework at position
    const createFirework = (x, y) => {
      fireworksArray.push(new Firework(x, y))
    }

    // Handle click/touch
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      createFirework(x, y)
    }

    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      createFirework(x, y)
    })

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw fireworks
      for (let i = fireworksArray.length - 1; i >= 0; i--) {
        fireworksArray[i].update()
        fireworksArray[i].draw(ctx)
        
        if (fireworksArray[i].isDone()) {
          fireworksArray.splice(i, 1)
        }
      }

      // Random fireworks
      if (autoLaunch && Math.random() < 0.05 && fireworksArray.length < 15) {
        createRandomFirework()
      }

      // Create background particles
      if (Math.random() < 0.3) {
        particlesArray.push(new Particle(
          Math.random() * canvas.width,
          canvas.height,
          `hsl(${Math.random() * 60 + 300}, 100%, 60%)`
        ))
      }

      // Update and draw particles
      for (let i = particlesArray.length - 1; i >= 0; i--) {
        particlesArray[i].update()
        particlesArray[i].draw(ctx)
        
        if (particlesArray[i].life <= 0) {
          particlesArray.splice(i, 1)
        }
      }

      setFireworks([...fireworksArray])
      setParticles([...particlesArray])

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Initial fireworks
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createRandomFirework(), i * 300)
      }
    }, 500)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('click', handleClick)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [autoLaunch])

  const launchManyFireworks = () => {
    if (!canvasRef.current) return
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const x = Math.random() * canvasRef.current.width
        const y = Math.random() * canvasRef.current.height * 0.7
        // We can't directly call createFirework here, so we'll use confetti
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { x: x / canvasRef.current.width, y: y / canvasRef.current.height },
          colors: ['#FF3CAC', '#F687B3', '#D8B4FE', '#C084FC', '#F472B6'],
        })
      }, i * 100)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      
      {/* Overlay content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 drop-shadow mb-4">
            Grand Finale! 🎇
          </h1>
          <p className="text-xl text-pink-200">
            Click anywhere to launch more fireworks!
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <GradientButton onClick={launchManyFireworks}>
            <Zap size={20} />
            Mega Fireworks
          </GradientButton>
          
          <button
            onClick={() => setAutoLaunch(!autoLaunch)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              autoLaunch 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300'
            }`}
          >
            {autoLaunch ? 'Auto: ON' : 'Auto: OFF'}
          </button>
          
          <GradientButton onClick={onNext}>
            <Home size={20} />
            Start Over
          </GradientButton>
        </div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 text-center"
        >
          <p className="text-lg text-pink-300">
            Fireworks Active: {fireworks.length} | Particles: {particles.length}
          </p>
          <p className="text-sm text-pink-200/70 mt-2">
            Made with ❤️ for {process.env.NEXT_PUBLIC_RECIPIENT_NAME}'s {process.env.NEXT_PUBLIC_BIRTHDAY_AGE}th Birthday
          </p>
        </motion.div>
      </div>
    </div>
  )
}
