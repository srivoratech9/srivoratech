import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProjectCards from './components/ProjectCards'
import QuoteBlock from './components/QuoteBlock'
import Challenges from './components/Challenges'
import WhyChoose from './components/WhyChoose'
import OnboardingSteps from './components/OnboardingSteps'
import Services from './components/Services'
import TechStack from './components/TechStack'
import WorkShowcase from './components/WorkShowcase'
import Achievements from './components/Achievements'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import PreFooterCTA from './components/PreFooterCTA'
import Footer from './components/Footer'

export default function App() {
  const glowRef = useRef(null)

  useEffect(() => {
    const glow = glowRef.current
    let animFrame

    const handleMouseMove = (e) => {
      if (glow) {
        if (animFrame) cancelAnimationFrame(animFrame)
        animFrame = requestAnimationFrame(() => {
          glow.style.left = e.clientX + 'px'
          glow.style.top = e.clientY + 'px'
          glow.classList.add('active')
        })
      }

      // Interactive card mouse-follow spotlight & 3D tilt
      const card = e.target.closest(
        '.challenge-card, .service-card, .why-card, .work-card, .achievement-card, .onboarding-step, .faq-item, .project-card, .spotlight-card'
      )
      if (card) {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const tiltX = ((y - centerY) / centerY) * -5
        const tiltY = ((x - centerX) / centerX) * 5

        card.style.setProperty('--mouse-x', `${x}px`)
        card.style.setProperty('--mouse-y', `${y}px`)
        card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
        card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
      }
    }

    const handleMouseOut = (e) => {
      const card = e.target.closest(
        '.challenge-card, .service-card, .why-card, .work-card, .achievement-card, .onboarding-step, .faq-item, .project-card, .spotlight-card'
      )
      if (card && !card.contains(e.relatedTarget)) {
        card.style.setProperty('--tilt-x', '0deg')
        card.style.setProperty('--tilt-y', '0deg')
      }
    }

    const handleMouseLeave = () => {
      if (glow) glow.classList.remove('active')
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animFrame) cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <div className="app">
      {/* Mouse-follow cursor glow */}
      <div ref={glowRef} className="cursor-glow" />
      <Navbar />
      <main>
        <Hero />
        <ProjectCards />
        <QuoteBlock />
        <Challenges />
        <WhyChoose />
        <OnboardingSteps />
        <Services />
        <TechStack />
        <WorkShowcase />
        <Achievements />
        <FAQ />
        <Contact />
        <PreFooterCTA />
      </main>
      <Footer />
    </div>
  )
}
