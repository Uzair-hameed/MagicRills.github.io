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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              <!-- Google Tag Manager -->
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-4JE1RK9B0K');
              <!-- End Google Tag Manager -->
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <!-- Google Tag Manager (noscript) -->
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-4JE1RK9B0K"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>
        </noscript>
        <!-- End Google Tag Manager (noscript) -->
        {children}
      </body>
    </html>
  );
}
