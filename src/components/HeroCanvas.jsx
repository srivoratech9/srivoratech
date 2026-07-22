import { useEffect, useRef } from 'react'

const colorSchemes = {
  sapphire: {
    nodes: ['rgba(0, 103, 244, 0.55)', 'rgba(99, 102, 241, 0.55)', 'rgba(56, 189, 248, 0.45)'],
    line: '0, 103, 244',
  },
  sunset: {
    nodes: ['rgba(245, 158, 11, 0.55)', 'rgba(239, 68, 68, 0.55)', 'rgba(249, 115, 22, 0.45)'],
    line: '249, 115, 22',
  },
  emerald: {
    nodes: ['rgba(16, 185, 129, 0.55)', 'rgba(6, 182, 212, 0.55)', 'rgba(34, 197, 94, 0.45)'],
    line: '16, 185, 129',
  },
  cosmic: {
    nodes: ['rgba(139, 92, 246, 0.55)', 'rgba(236, 72, 153, 0.55)', 'rgba(168, 85, 247, 0.45)'],
    line: '139, 92, 246',
  },
}

export default function HeroCanvas({ colorMode = 'sapphire' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 780)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = canvas.parentElement?.offsetHeight || 780
    }
    window.addEventListener('resize', handleResize)

    // Mouse tracking
    const mouse = { x: -1000, y: -1000, radius: 180 }
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove)
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave)

    // Particle nodes
    const particleCount = Math.min(Math.floor(width / 20), 52)
    const particles = []

    const scheme = colorSchemes[colorMode] || colorSchemes.sapphire

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.8 + 1.2,
        colorIndex: Math.floor(Math.random() * scheme.nodes.length),
        pulse: Math.random() * Math.PI * 2,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const currentScheme = colorSchemes[colorMode] || colorSchemes.sapphire

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        p1.x += p1.vx
        p1.y += p1.vy
        p1.pulse += 0.03

        if (p1.x < 0 || p1.x > width) p1.vx *= -1
        if (p1.y < 0 || p1.y > height) p1.vy *= -1

        // Mouse attraction
        const dxMouse = p1.x - mouse.x
        const dyMouse = p1.y - mouse.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        if (distMouse < mouse.radius) {
          const force = (mouse.radius - distMouse) / mouse.radius
          const angle = Math.atan2(dyMouse, dxMouse)
          p1.x += Math.cos(angle) * force * 2.5
          p1.y += Math.sin(angle) * force * 2.5
        }

        // Draw node with subtle pulse ring
        const currentRadius = p1.radius + Math.sin(p1.pulse) * 0.6
        ctx.beginPath()
        ctx.arc(p1.x, p1.y, currentRadius, 0, Math.PI * 2)
        ctx.fillStyle = currentScheme.nodes[p1.colorIndex % currentScheme.nodes.length]
        ctx.fill()

        // Connect near nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${currentScheme.line}, ${alpha})`
            ctx.lineWidth = 0.9
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove)
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [colorMode])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.88,
      }}
    />
  )
}
