import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Train Dashboard',
  description: 'Train performance monitoring dashboard',
  generator: 'v0.dev',
  icons: {
    icon: '/icons/train-icon.svg',
    shortcut: '/icons/train-icon.svg',
    apple: '/icons/train-icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
