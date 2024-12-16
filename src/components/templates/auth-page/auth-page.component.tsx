'use client'
import { Button, Text, Heading } from '@/components/atoms'
import FetchApiProvider from '@/providers/fetch-api-provider'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export function AuthPage({ children }: React.PropsWithChildren<{}>) {
    const session = useSession()
    const pathname = usePathname()
    const router = useRouter()
    if (session.status === 'loading')
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <div className="w-56 h-56 flex animate-pulse relative">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/loading.png`}
                        alt="logo-image"
                        fill
                    />
                </div>
            </div>
        )
    else if (pathname.startsWith('/admin') && session.data?.user.role !== 'admin')
        return (
            <div className="h-screen w-screen flex justify-center items-center px-4 lg:px-0">
                <div className="h-1/3 lg:w-1/3 w-full flex space-x-2 justify-center items-center rounded-md shadow-lg outline outline-gray-400 p-5">
                    <div className="relative flex-auto h-full w-[40%]">
                        <Image
                            alt="request"
                            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/unauth.PNG`}
                            objectFit="contain"
                            fill
                            className="inset-0 rounded-2xl"
                        />
                    </div>
                    <div className="flex flex-col space-y-6 w-[60%]">
                        <div>
                            <Heading order={4}>
                                <Text span fw={'bolder'} fz="xl">
                                    404:
                                </Text>
                                {'  '}
                                Unauthenticated
                            </Heading>
                            <Text color="gray">{`You don't have any access to this site`}</Text>
                        </div>
                        <div className="space-y-1 flex flex-col items-start">
                            <Button
                                variant="outline"
                                color="blue"
                                onClick={() =>
                                    signOut({
                                        callbackUrl: `${
                                            process.env.NEXT_PUBLIC_BASE_PATH || ''
                                        }/accounts/login`,
                                    })
                                }
                                fullWidth
                            >
                                Go to Login Page
                            </Button>
                            <Button
                                variant="white"
                                onClick={router.back}
                                color="gray"
                                className="hover:underline !px-0"
                            >
                                Go back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    return <FetchApiProvider token={session.data?.token}>{children}</FetchApiProvider>
}
