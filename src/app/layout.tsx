"use client"

import { usePathname } from 'next/navigation'
import { Saira } from 'next/font/google'
import ThemeProvider from '@/providers/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { AppSidebar } from "@/components/app-sidebar"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

const saira = Saira({
  subsets: ['latin'],
  weight: ['300', '400', '500','600', '700'],
  variable: '--font-saira',
})

const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  // Add any other public routes here
]

// export const metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: 'Next.js and Supabase Starter Kit',
//   description: 'The fastest way to build apps with Next.js and Supabase',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPublicRoute = publicRoutes.includes(pathname)

  return (
    <html
      lang="en"
      className={`${saira.variable} font-sans`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="bg-neutral-950 text-neutral-400 dark">
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <div className="flex min-h-screen">
              {!isPublicRoute && <AppSidebar />}
              <main className="flex flex-1 flex-col">
                {children}
              </main>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
