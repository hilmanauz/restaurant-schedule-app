'use client'
import React from 'react'
import AuthProvider from './auth-provider'
import { Notifications } from '@mantine/notifications'
import { SWRConfig } from 'swr'
import { MantineProvider } from '@mantine/core'
import { AuthPage } from '@/components/templates'

function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [hydrated, setHydrated] = React.useState(false)
    React.useEffect(() => {
        setHydrated(true)
    }, [])
    if (!hydrated) {
        return null
    }
    return (
        <AuthProvider>
            <AuthPage>
                <MantineProvider
                    theme={{
                        headings: {
                            fontFamily: 'Greycliff CF, sans-serif',
                        },
                        fontFamily: 'Geist, sans-serif',
                        fontSizes: {
                            base: '14px',
                            sm: '12px',
                        },
                    }}
                    withGlobalStyles
                    withNormalizeCSS
                >
                    <SWRConfig
                        value={{
                            shouldRetryOnError: false,
                        }}
                    >
                        {children}
                        <Notifications />
                    </SWRConfig>
                </MantineProvider>
            </AuthPage>
        </AuthProvider>
    )
}

export default GlobalProvider
