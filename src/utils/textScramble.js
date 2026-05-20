const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

export function scrambleText(element, finalText, duration = 1200) {
  let frame = 0
  const totalFrames = Math.floor(duration / 16)
  let raf

  const tick = () => {
    const progress = frame / totalFrames
    const resolved = Math.floor(progress * finalText.length)

    element.textContent = finalText
      .split('')
      .map((char, i) => {
        if (i < resolved) return char
        if (char === ' ' || char === '\n') return char
        return chars[Math.floor(Math.random() * chars.length)]
      })
      .join('')

    frame++
    if (frame <= totalFrames) {
      raf = requestAnimationFrame(tick)
    } else {
      element.textContent = finalText
    }
  }

  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}