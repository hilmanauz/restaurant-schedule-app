import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const loginFetch = (payload: { username: string; password: string }) =>
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'}/users/login`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const nextAuthSession: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'username',
                    type: 'text',
                    placeholder: 'johnd',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) return
                const payload = {
                    username: credentials.username,
                    password: credentials.password,
                }
                const res = await loginFetch(payload)
                const data = await res.json()
                if (!res.ok) {
                    throw new Error(data.message)
                }
                if (res.ok && data) {
                    return {
                        ...data.data,
                        username: payload.username,
                        id: 'test-1',
                    }
                }
                return null
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }: any) {
            if (account && user) {
                return {
                    ...token,
                    user: {
                        username: user.username,
                        role: user.role,
                    },
                    token: user.token,
                }
            }

            return token
        },

        session({ session, token }: any) {
            session.token = token.token
            session.user.username = token.user.username
            session.user.role = token.user.role
            return session
        },
    },
    pages: {
        signIn: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/login`,
    },
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
}
