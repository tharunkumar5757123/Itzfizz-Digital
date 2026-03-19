import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

const metrics = [
  { value: '58%', label: 'Increase in pick up point use', className: 'stat-1' },
  { value: '27%', label: 'Increase in pick up point use', className: 'stat-3' },
  { value: '23%', label: 'Decreased in customer phone calls', className: 'stat-2' },
  { value: '40%', label: 'Decreased in customer phone calls', className: 'stat-4' },
]

const headlineText = 'WELCOME ITZFIZZ'

function App() {
  const heroRef = useRef(null)
  const trackRef = useRef(null)
  const carRef = useRef(null)
  const headlineRef = useRef(null)
  const progressRef = useRef(null)
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const car = carRef.current
    const track = trackRef.current
    const headline = headlineRef.current
    const progress = progressRef.current

    if (!car || !track || !headline || !progress) return

    const ctx = gsap.context(() => {
      gsap.set(car, { x: -220, y: 0, scale: 1, rotate: 0 })
      gsap.set(progress, { width: 0 })

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=600',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      })

      const scrollTrigger = {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=600',
        scrub: 1.5,
        invalidateOnRefresh: true,
      }

      const getTrackWidth = () => track.getBoundingClientRect().width

      const getCarEndX = () => {
        const trackBox = track.getBoundingClientRect()
        const carBox = car.getBoundingClientRect()
        return trackBox.width - carBox.width + 20
      }

      gsap.to(car, {
        x: () => getCarEndX(),
        y: -40,
        scale: 1.2,
        rotate: 10,
        ease: 'none',
        scrollTrigger,
      })

      gsap.to(progress, {
        width: () => getTrackWidth(),
        ease: 'none',
        scrollTrigger,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <div className="page">
      <section className="hero" ref={heroRef}>
        <div className="track" ref={trackRef}>
          <div className="progress" ref={progressRef}>
            <h1 className="headline" aria-label={headlineText} ref={headlineRef}>
              {headlineText.split('').map((char, index) => (
                <span
                  className={`char${char === ' ' ? ' space' : ''}`}
                  key={`${char}-${index}`}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>

          <div className="car" ref={carRef} aria-hidden="true">
            <div className="car-shell"></div>
            <div className="car-cockpit"></div>
            <div className="car-line"></div>
            <div className="car-wheel wheel-front"></div>
            <div className="car-wheel wheel-back"></div>
          </div>
        </div>

        <div className="stats">
          {metrics.map((metric) => (
            <div className={`stat ${metric.className}`} key={metric.value}>
              <span className="stat-value">{metric.value}</span>
              <span className="stat-label">{metric.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="spacer" aria-hidden="true"></section>
    </div>
  )
}

export default App
