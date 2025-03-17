import type {Metadata} from 'next';
import './globals.css';

import Footer from './components/Footer';
import {BottomMobileBgCover, TopMobileBgCover} from './components/navigation/mobileBgCover';
import Nav from './components/navigation/Nav';
import ParallaxWrapper from './components/ParallaxWrapper';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
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
        <ParallaxWrapper>
          <div className='relative bg-background flex flex-col items-center justify-center grow h-full overflow-hidden z-0'>
            <TopMobileBgCover />
            <BottomMobileBgCover />
            {children}
          </div>
        </ParallaxWrapper>
        <Footer />
      </body>
    </html>
  );
}
