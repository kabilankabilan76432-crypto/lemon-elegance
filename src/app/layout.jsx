import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Lemon Elegance | Beauty Parlour Management System',
  description: 'Experience pure luxury and personalized wellness at Lemon Elegance. Book online for facials, hair spa, bridal rituals & care routines.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="bg-[#FAF7F2] text-[#2C221E] font-sans antialiased min-h-screen flex flex-col selection:bg-[#C5A880] selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
