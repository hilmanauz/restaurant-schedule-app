import { HeaderNav } from '@/components/organisms'
import FooterNav from '@/components/organisms/footer-nav/footer-nav.component'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <HeaderNav />
            {children}
            <FooterNav />
        </>
    )
}
