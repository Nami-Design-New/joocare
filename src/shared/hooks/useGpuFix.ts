// hooks/useGpuFix.ts
import { useEffect } from 'react'

export function useGpuFix() {
    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>(
            '[class*="fixed"], [class*="sticky"], [class*="navbar"], [class*="header"]'
        )
        elements.forEach((el) => {
            el.style.transform = 'translateZ(0)'
            el.style.webkitTransform = 'translateZ(0)'
            el.style.willChange = 'transform'
            el.style.backfaceVisibility = 'hidden'
        })

        return () => {
            // Cleanup لما تخرج من الصفحة
            elements.forEach((el) => {
                el.style.transform = ''
                el.style.willChange = ''
                el.style.backfaceVisibility = ''
            })
        }
    }, [])
}