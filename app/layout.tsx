import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { DoubleTapToTop } from '@/components/double-tap-to-top'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Futurxt | Web & SaaS Development Agency',
  description: 'Futurxt builds fast, scalable web applications, SaaS platforms, and AI-powered solutions for clients worldwide.',
  icons: {
    icon: "/Futurax.icon.png",
    shortcut: "/Futurax.icon.png",
    apple: "/Futurax.icon.png",
  },
  openGraph: {
    title: 'Futurxt | Web & SaaS Development Agency',
    description: 'We build fast, scalable web apps and SaaS platforms for clients worldwide.',
    url: 'https://futurxt.dev',
    siteName: 'Futurxt',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Futurxt - Building the Future' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Futurxt | Web & SaaS Development Agency',
    description: 'We build fast, scalable web apps and SaaS platforms for clients worldwide.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <DoubleTapToTop />
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}