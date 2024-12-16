// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { User } from 'next-auth'

export type UserRole = 'admin' | 'user'

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
     */
    interface Session {
        token: string
        user: {
            role: UserRole
            username?: string
        } & DefaultSession['user']
        error?: 'RefreshAccessTokenError'
    }
}
