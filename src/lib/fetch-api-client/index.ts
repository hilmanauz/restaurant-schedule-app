import { FetchApiProps } from './types'
import { signOut } from 'next-auth/react'

export const ApiClient: FetchApiProps = (client) => {
    return {
        register: async (props) => {
            const { data } = await client.post(`/users/register`, props)
            return data
        },
        getData: async (api) => {
            try {
                const data = await client.get(api)
                return data
            } catch (error) {
                const errorData = error as {
                    response: {
                        data: { code: number }
                    }
                }
                if (errorData.response.data.code === 401)
                    signOut({
                        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/accounts/login`,
                    })
            }
        },
        createRestaurant: async (props) => {
            const { data } = await client.post(`/restaurants`, props)
            return data
        },
        updateRestaurant: async (props) => {
            const { id, ...item } = props
            const { data } = await client.put(`/restaurants/${props.id}`, item)
            return data
        },
        updateSchedule: async (props) => {
            const { id, ...item } = props.schedule
            const { data } = await client.put(`/schedules/${id}`, item)
            return data
        },
        createSchedule: async ({ restaurantId, schedule }) => {
            const { data } = await client.post(`/restaurants/${restaurantId}/schedules`, schedule)
            return data
        },
        deleteRestaurant: async (props) => {
            const { data } = await client.delete(`/restaurants/${props.id}`)
            return data
        },
        deleteSchedule: async (props) => {
            const { data } = await client.delete(`/schedules/${props.id}`)
            return data
        },
    }
}
