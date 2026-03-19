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
    const glow = glowRef.current
    if (!visual) return
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.set(visual, { x: -120, y: 40, rotate: -8, scale: 0.96 })
      if (glow) gsap.set(glow, { opacity: 0.2 })
      if (orbOneRef.current) gsap.set(orbOneRef.current, { y: 0 })
      if (orbTwoRef.current) gsap.set(orbTwoRef.current, { y: 0 })
      if (orbThreeRef.current) gsap.set(orbThreeRef.current, { y: 0 })

      gsap.to(visual, {
        x: 360,
        y: -150,
        rotate: 22,
        scale: 1.16,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.4,
        },
      })

      if (glow) {
        gsap.to(glow, {
          opacity: 0.9,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4,
          },
        })
      }

      if (orbOneRef.current) {
        gsap.to(orbOneRef.current, {
          y: 120,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.6,
          },
        })
      }

      if (orbTwoRef.current) {
        gsap.to(orbTwoRef.current, {
          y: -140,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.6,
          },
        })
      }

      if (orbThreeRef.current) {
        gsap.to(orbThreeRef.current, {
          y: 90,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.6,
          },
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
          <p className="eyebrow">Scroll-Driven Showcase</p>
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
