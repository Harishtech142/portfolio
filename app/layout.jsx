import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import ClientLayout from '../components/ClientLayout'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata = {
  title: 'TrexFlow — AI Automation & Web Developer',
  description: 'Portfolio of TrexFlow — specializing in AI Automation, AI Agents, and modern Web Development. Building the future with intelligent systems.',
  keywords: 'AI Automation, AI Agents, Web Developer, Portfolio, Machine Learning, Full Stack',
  authors: [{ name: 'TrexFlow' }],
  metadataBase: new URL('https://placeholder.TrexFlow.dev'),
  openGraph: {
    type: 'website',
    url: 'https://placeholder.TrexFlow.dev/',
    title: 'TrexFlow — AI Automation & Web Developer',
    description: 'Portfolio of TrexFlow — specializing in AI Automation, AI Agents, and modern Web Development.',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    url: 'https://placeholder.TrexFlow.dev/',
    title: 'TrexFlow — AI Automation & Web Developer',
    description: 'Portfolio of TrexFlow — specializing in AI Automation, AI Agents, and modern Web Development.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  robots: 'index, follow',
}

export const viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0a0a0a] text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
