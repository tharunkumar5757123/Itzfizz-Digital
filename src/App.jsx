import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import './App.css'

const metrics = [
  { value: '98%', label: 'Scroll smoothness score' },
  { value: '4.6s', label: 'Average session depth' },
  { value: '120k', label: 'Monthly interactions' },
]

const headlineText = 'WELCOME ITZFIZZ'

function App() {
  const heroRef = useRef(null)
  const visualRef = useRef(null)
  const glowRef = useRef(null)
  const rafRef = useRef(0)
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.set('.char', { opacity: 0, yPercent: 25 })
      gsap.set('.stat', { opacity: 0, y: 18 })

      gsap.to('.char', {
        opacity: 1,
        yPercent: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.04,
      })

      gsap.to('.stat', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.35,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  useEffect(() => {
    const visual = visualRef.current
    if (!visual) return
    if (prefersReducedMotion) return

    const setVisual = gsap.quickSetter(visual, 'transform')
    const setGlow = glowRef.current
      ? gsap.quickSetter(glowRef.current, 'opacity')
      : null

    const state = {
      x: 0,
      y: 0,
      rotate: -2,
      scale: 1,
      glow: 0,
    }

    const target = { ...state }

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

    const updateTargets = () => {
      const viewport = window.innerHeight
      const scrollY = window.scrollY
      const progress = clamp(scrollY / (viewport * 1.4), 0, 1)

      target.x = -60 + progress * 240
      target.y = 20 + progress * -90
      target.rotate = -6 + progress * 18
      target.scale = 1 + progress * 0.08
      target.glow = 0.2 + progress * 0.65
    }

    const tick = () => {
      state.x += (target.x - state.x) * 0.08
      state.y += (target.y - state.y) * 0.08
      state.rotate += (target.rotate - state.rotate) * 0.08
      state.scale += (target.scale - state.scale) * 0.08
      state.glow += (target.glow - state.glow) * 0.08

      setVisual(
        `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.rotate}deg) scale(${state.scale})`
      )
      if (setGlow) setGlow(state.glow)

      rafRef.current = requestAnimationFrame(tick)
    }

    updateTargets()
    rafRef.current = requestAnimationFrame(tick)

    const handleScroll = () => {
      updateTargets()
    }

    const handleResize = () => updateTargets()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="page">
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" aria-hidden="true">
          <span className="orb orb-one"></span>
          <span className="orb orb-two"></span>
          <span className="orb orb-three"></span>
        </div>

        <div className="hero-content">
          <p className="eyebrow">Scroll-Driven Showcase</p>
          <h1 className="headline" aria-label={headlineText}>
            {headlineText.split('').map((char, index) => (
              <span
                key={`${char}-${index}`}
                className={`char${char === ' ' ? ' space' : ''}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <div className="stats">
            {metrics.map((metric) => (
              <div className="stat" key={metric.label}>
                <span className="stat-value">{metric.value}</span>
                <span className="stat-label">{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="cta-row">
            <button className="primary">Start the ride</button>
            <button className="ghost">View process</button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow" ref={glowRef} aria-hidden="true"></div>
          <div className="car" ref={visualRef} aria-hidden="true">
            <div className="car-shell"></div>
            <div className="car-cockpit"></div>
            <div className="car-line"></div>
            <div className="car-wheel wheel-front"></div>
            <div className="car-wheel wheel-back"></div>
          </div>
        </div>
      </section>

      <section className="story">
        <div className="story-card">
          <h2>Scroll-triggered momentum</h2>
          <p>
            As you move down the page, the hero object glides, rotates, and
            scales based on scroll progress. The animation uses interpolation to
            keep motion buttery-smooth and avoid abrupt jumps.
          </p>
        </div>
        <div className="story-card">
          <h2>Premium UI polish</h2>
          <p>
            Typography, spacing, and layered gradients deliver a premium first
            impression. The intro animation uses GSAP for crisp, staggered
            reveals without heavy layout work.
          </p>
        </div>
      </section>

      <section className="footer">
        <h3>Keep scrolling for depth</h3>
        <p>
          This section exists to provide scroll length and demonstrate that the
          hero animation is linked to user interaction, not time-based autoplay.
        </p>
      </section>
    </div>
  )
}

export default App
