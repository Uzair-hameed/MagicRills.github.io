import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Magicrills - AI Educational Tools',
  description: '110+ AI-powered educational tools for teachers, students, and administrators',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4JE1RK9B0K"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4JE1RK9B0K');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
