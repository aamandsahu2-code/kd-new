"use client"

import { useEffect, useRef } from 'react'

export default function FireworksEffect() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let particles = []
    let mouse = { x: 0, y: 0 }
    let isMouseDown = false

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

      draw() {
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
        const particleCount = 100
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = Math.random() * 5 + 2
          const particle = {
            x: this.x,
            y: this.y,
            color: this.color,
            size: Math.random() * 3 + 1,
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

      draw() {
        this.particles.forEach(p => {
          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })
      }

      isDone() {
        return this.particles.length === 0
      }
    }

    let fireworks = []

    // Create random firework
    const createRandomFirework = () => {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height * 0.5
      fireworks.push(new Firework(x, y))
    }

    // Create firework at position
    const createFirework = (x, y) => {
      fireworks.push(new Firework(x, y))
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update()
        fireworks[i].draw()
        
        if (fireworks[i].isDone()) {
          fireworks.splice(i, 1)
        }
      }

      // Random fireworks
      if (Math.random() < 0.03 && fireworks.length < 10) {
        createRandomFirework()
      }

      // Mouse trail particles
      if (isMouseDown) {
        for (let i = 0; i < 5; i++) {
          particles.push(new Particle(mouse.x, mouse.y, `hsl(${Math.random() * 360}, 100%, 50%)`))
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update()
        particles[i].draw()
        
        if (particles[i].life <= 0) {
          particles.splice(i, 1)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Mouse events
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseDown = () => {
      isMouseDown = true
      createFirework(mouse.x, mouse.y)
    }

    const handleMouseUp = () => {
      isMouseDown = false
    }

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      createFirework(x, y)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      mouse.x = touch.clientX - rect.left
      mouse.y = touch.clientY - rect.top
      createFirework(mouse.x, mouse.y)
    })

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('click', handleClick)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 10 }}
    />
  )
}
