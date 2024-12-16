'use client'
import { AccountContent } from '@/components/organisms'
import { useFetchApi } from '@/providers/fetch-api-provider'
import { handleErrorMessage } from '@/utils'
import { notifications } from '@mantine/notifications'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { AiOutlineCheck, AiOutlineLock, AiOutlineWarning } from 'react-icons/ai'
import { BsPeople } from 'react-icons/bs'
import { FaPeopleArrows } from 'react-icons/fa6'

const ForgotPassword = () => {
    const router = useRouter()
    const client = useFetchApi()
    const onSubmit = React.useCallback(
        async (values: Record<string, any>, close: () => void) => {
            try {
                await client.register({
                    name: values.name,
                    password: values.password,
                    username: values.username,
                    role: 'user',
                })
                close()
                notifications.show({
                    message: 'Registration Successfull!',
                    title: 'Success',
                    color: 'blue',
                    icon: <AiOutlineCheck />,
                })
                router.push('/login')
            } catch (error) {
                console.log(error)
                close()
                notifications.show({
                    message: handleErrorMessage(error),
                    title: 'Error',
                    color: 'red',
                    icon: <AiOutlineWarning />,
                })
            }
        },
        [client]
    )
    return (
        <section className="flex-auto grid lg:grid-cols-2 grid-cols-1">
            <div className="lg:col-span-1 hidden lg:flex lg:flex-col lg:justify-center lg:items-center bg-sky-100">
                <div className="w-full relative h-[90%] flex justify-center items-center">
                    <Image
                        alt="login-banner"
                        src={`/images/kitchen.png`}
                        objectFit="contain"
                        height={500}
                        width={500}
                        className="max-w-[85%] top-0 left-0 object-contain rounded-2xl"
                    />
                </div>
            </div>
            <div className="col-span-1 h-full w-full flex bg-white relative">
                <AccountContent
                    title="Create Your Account"
                    description="Sign up to see our restaurants schedule list."
                    onSubmit={onSubmit}
                    formData={{
                        name: {
                            type: 'text',
                            label: 'Name',
                            leftIcon: <FaPeopleArrows />,
                            options: { format: 'string' },
                        },
                        username: {
                            type: 'text',
                            label: 'Username',
                            leftIcon: <BsPeople />,
                            options: { format: 'string' },
                        },
                        password: {
                            type: 'password',
                            label: 'Password',
                            leftIcon: <AiOutlineLock />,
                            required: true,
                            options: {
                                validation: false,
                            },
                        },
                    }}
                    type="register"
                    submitLabel="Register"
                />
            </div>
        </section>
    )
}

export default ForgotPassword
