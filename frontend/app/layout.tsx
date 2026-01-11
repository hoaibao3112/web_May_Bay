import '../styles/globals.css'
import Providers from './providers'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import ChatWidget from './components/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BayNhanh - Đặt vé máy bay, khách sạn, xe khách',
  description: 'Nền tảng đặt vé du lịch hàng đầu Việt Nam',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  )
}
