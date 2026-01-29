import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Theology of Ambition',
  description:
    'Ambition isn\'t the problem. Unredeemed ambition is. A serious theological project asking: what does ambition look like after the cross?',
  openGraph: {
    title: 'Theology of Ambition',
    description:
      'Ambition isn\'t the problem. Unredeemed ambition is. What does ambition look like after the cross?',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Theology of Ambition',
    description:
      'Ambition isn\'t the problem. Unredeemed ambition is. What does ambition look like after the cross?',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
