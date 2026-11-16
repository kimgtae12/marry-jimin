import type { SVGProps } from 'react'

export function Heart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 29" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M16 28.6 13.7 26.5C5.6 19.2.3 14.4.3 8.5.3 3.7 4 0 8.8 0c2.7 0 5.3 1.3 7.2 3.3C17.9 1.3 20.5 0 23.2 0 28 0 31.7 3.7 31.7 8.5c0 5.9-5.3 10.7-13.4 18L16 28.6Z"
      />
    </svg>
  )
}
