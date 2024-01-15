import { useState, useEffect } from 'react'

export const useDevice = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth } = window

      setIsMobile(innerWidth <= 640)
      setIsTablet(innerWidth > 640 && innerWidth <= 834)
      setIsDesktop(innerWidth > 1024)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { isMobile, isTablet, isDesktop }
}
