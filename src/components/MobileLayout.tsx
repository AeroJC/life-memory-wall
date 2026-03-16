import { useEffect } from 'react'
import { usePlatform } from '../hooks/usePlatform'

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const { isNative } = usePlatform()

  // Add native-app class to html element so CSS can target it
  useEffect(() => {
    if (isNative) {
      document.documentElement.classList.add('native-app')
    }
    return () => {
      document.documentElement.classList.remove('native-app')
    }
  }, [isNative])

  if (!isNative) return <>{children}</>

  return (
    <div
      className="safe-top safe-bottom overflow-x-hidden overflow-y-auto"
      style={{
        height: '100%',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none',
      }}
    >
      {children}
    </div>
  )
}
