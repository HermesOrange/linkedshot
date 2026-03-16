import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LinkedShot - AI Professional Headshots | RM79 | Malaysia',
  description:
    'Get 50+ LinkedIn-ready professional headshots in 5 minutes. Trusted by 500+ Malaysian professionals. Only RM79. Money-back guarantee.',
  keywords: [
    'AI headshots Malaysia',
    'LinkedIn profile photo',
    'professional headshot Malaysia',
    'AI portrait Malaysia',
    'LinkedIn photo RM79',
  ],
  authors: [{ name: 'LinkedShot' }],
  creator: 'LinkedShot',
  publisher: 'LinkedShot',
  metadataBase: new URL('https://linkedshot.com.my'),
  openGraph: {
    title: 'LinkedShot - AI Professional Headshots | RM79 | Malaysia',
    description:
      'Get 50+ LinkedIn-ready professional headshots in 5 minutes. Trusted by 500+ Malaysian professionals. Only RM79.',
    url: 'https://linkedshot.com.my',
    siteName: 'LinkedShot',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LinkedShot - Professional AI Headshots',
      },
    ],
    locale: 'en_MY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedShot - AI Professional Headshots | RM79 | Malaysia',
    description: 'Get 50+ LinkedIn-ready professional headshots in 5 minutes.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'LinkedShot AI Professional Headshots',
      description:
        'Get 50+ LinkedIn-ready professional headshots in 5 minutes using AI.',
      offers: {
        '@type': 'Offer',
        price: '79',
        priceCurrency: 'MYR',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'LinkedShot',
        },
      },
      brand: {
        '@type': 'Brand',
        name: 'LinkedShot',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '500',
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#0A66C2" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
