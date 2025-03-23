import type {Metadata} from 'next';
import './globals.css';

import Footer from './components/Footer';
import {BottomMobileBgCover, TopMobileBgCover} from './components/navigation/mobileBgCover';
import Nav from './components/navigation/Nav';

export const metadata: Metadata = {
  title: 'Etan Heyman',
  description: 'Personal website of Etan Heyman | UI/UX Design by Dor Zohar (ProductDZ)',
  keywords: ['developer', 'portfolio', 'software engineer', 'Dor Zohar', 'ProductDZ', 'UI/UX design'],
  authors: [{name: 'Etan Heyman'}, {name: 'Dor Zohar', url: 'https://www.productdz.com'}],
  creator: 'Etan Heyman',
  publisher: 'Etan Heyman',
  metadataBase: new URL('https://etanheyman.com'),
  alternates: {
    canonical: '/'
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [{url: '/favicon/favicon.ico'}, {url: '/favicon/favicon.svg', type: 'image/svg+xml'}, {url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png'}],
    apple: [{url: '/favicon/apple-touch-icon.png'}],
    other: [{rel: 'manifest', url: '/favicon/site.webmanifest'}]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://etanheyman.com',
    title: 'Etan Heyman',
    description: 'Personal website of Etan Heyman | UI/UX Design by Dor Zohar (ProductDZ)',
    siteName: 'Etan Heyman',
    images: [
      {
        url: '/favicon/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Etan Heyman'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Etan Heyman',
    description: 'Personal website of Etan Heyman | UI/UX Design by Dor Zohar (ProductDZ)',
    images: ['/favicon/web-app-manifest-512x512.png']
  },
  verification: {
    other: {
      designer: 'https://www.productdz.com',
      'designer-linkedin': 'https://www.linkedin.com/in/productdz/'
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`h-full flex flex-col justify-center overscroll-none -z-20 bg-background antialiased min-h-screen relative`}>
        {/* Top SVGs (fixed to viewport) */}
        <Nav />
        {/* Main content */}
        <div className='relative bg-background flex flex-col items-center justify-center grow h-full overflow-hidden z-0'>
          <TopMobileBgCover />
          <BottomMobileBgCover />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
