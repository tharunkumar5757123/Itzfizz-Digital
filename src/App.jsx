import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

const metrics = [
  { value: '58%', label: 'Increase in pick up point use' },
  { value: '23%', label: 'Decreased in customer phone calls' },
  { value: '27%', label: 'Increase in pick up point use' },
  { value: '40%', label: 'Decreased in customer phone calls' },
]

const headlineText = 'WELCOME ITZFIZZ'

const buildHeadlineSequence = (text) => {
  const words = text.split(' ')
  return words.flatMap((word, wordIndex) => {
    const letters = word
      .split('')
      .map((char, charIndex) => ({
        char,
        key: `${wordIndex}-${charIndex}`,
        spacer: false,
      }))

    if (wordIndex < words.length - 1) {
      letters.push({
        char: '',
        key: `space-${wordIndex}`,
        spacer: true,
      })
    }

    return letters
  })
}

function App() {
  const heroRef = useRef(null)
  const visualRef = useRef(null)
  const glowRef = useRef(null)
  const deviceRef = useRef(null)
  const orbOneRef = useRef(null)
  const orbTwoRef = useRef(null)
  const orbThreeRef = useRef(null)
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
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.16,
        delay: 0.45,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  useEffect(() => {
    const visual = visualRef.current
    const glow = glowRef.current
    if (!visual) return
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const content = heroRef.current?.querySelector('.hero-content')

      gsap.set(visual, { x: -220, y: 60, rotate: -10, scale: 0.94 })
      if (deviceRef.current)
        gsap.set(deviceRef.current, { y: 30, rotate: -6, scale: 0.98 })
      if (glow) gsap.set(glow, { opacity: 0.2 })
      if (orbOneRef.current) gsap.set(orbOneRef.current, { y: 0 })
      if (orbTwoRef.current) gsap.set(orbTwoRef.current, { y: 0 })
      if (orbThreeRef.current) gsap.set(orbThreeRef.current, { y: 0 })
      if (content) gsap.set(content, { y: 0 })

      const triggerSettings = {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=900',
        scrub: 1.6,
      }

      gsap.to(visual, {
        x: 620,
        y: -220,
        rotate: 28,
        scale: 1.24,
        ease: 'none',
        scrollTrigger: {
          ...triggerSettings,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      })

      if (glow) {
        gsap.to(glow, {
          opacity: 0.9,
          scale: 1.25,
          ease: 'none',
          scrollTrigger: triggerSettings,
        })
      }

      if (deviceRef.current) {
        gsap.to(deviceRef.current, {
          y: -80,
          rotate: 6,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: triggerSettings,
        })
      }

      if (orbOneRef.current) {
        gsap.to(orbOneRef.current, {
          y: 120,
          ease: 'none',
          scrollTrigger: triggerSettings,
        })
      }

      if (orbTwoRef.current) {
        gsap.to(orbTwoRef.current, {
          y: -140,
          ease: 'none',
          scrollTrigger: triggerSettings,
        })
      }

      if (orbThreeRef.current) {
        gsap.to(orbThreeRef.current, {
          y: 90,
          ease: 'none',
          scrollTrigger: triggerSettings,
        })
      }

      if (content) {
        gsap.to(content, {
          y: -60,
          ease: 'none',
          scrollTrigger: triggerSettings,
        })
      }

      const road = heroRef.current?.querySelector('.road')
      if (road) {
        gsap.set(road, { scaleX: 0.6, opacity: 0.4 })
        gsap.to(road, {
          scaleX: 1.15,
          opacity: 0.85,
          ease: 'none',
          scrollTrigger: triggerSettings,
        })
      }
    }, heroRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <div className="page">
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" aria-hidden="true">
          <span className="orb orb-one" ref={orbOneRef}></span>
          <span className="orb orb-two" ref={orbTwoRef}></span>
          <span className="orb orb-three" ref={orbThreeRef}></span>
        </div>

        <div className="hero-content">
          <h1 className="headline" aria-label={headlineText}>
            {buildHeadlineSequence(headlineText).map((item) =>
              item.spacer ? (
                <span className="word-gap" aria-hidden="true" key={item.key} />
              ) : (
                <span className="char" key={item.key}>
                  {item.char}
                </span>
              )
            )}
          </h1>

          <div className="stats">
            {metrics.map((metric) => (
              <div className="stat" key={metric.label}>
                <span className="stat-value">{metric.value}</span>
                <span className="stat-label">{metric.label}</span>
              </div>
            ))}
          </div>

        </div>

        <div className="hero-visual">
          <div className="glow" ref={glowRef} aria-hidden="true"></div>
          <div className="device" ref={deviceRef} aria-hidden="true">
            <div className="device-screen"></div>
            <div className="device-bar"></div>
          </div>
          <div className="road" aria-hidden="true"></div>
          <div className="car" ref={visualRef} aria-hidden="true">
            <div className="car-shell"></div>
            <div className="car-cockpit"></div>
            <div className="car-line"></div>
            <div className="car-wheel wheel-front"></div>
            <div className="car-wheel wheel-back"></div>
          </div>
        </div>
      </section>

      <section className="spacer" aria-hidden="true"></section>
    </div>
  )
}

export default App
