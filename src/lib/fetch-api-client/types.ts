import { ScheduleProps } from '@/components/organisms/restaurants-list/restaurants-list.types'
import { AxiosInstance, AxiosResponse } from 'axios'

export type ResponseAPIProps<T extends Record<string, any> = Record<string, any>> =
    | AxiosResponse<T, T>
    | undefined

export type DataFetcherResult<T> = {
    data: T
    meta: {
        last_page: number
        current_page: number
        per_page: number
        to: number
        total: number
    }
}

export type FetcherApi = {
    getData: <T extends Record<string, any>>(api: string) => Promise<ResponseAPIProps<T>>
    createRestaurant: ({ name }: { name: string }) => Promise<ResponseAPIProps>
    updateRestaurant: ({ name, id }: { name: string; id: number }) => Promise<ResponseAPIProps>
    updateSchedule: ({ schedule }: { schedule: ScheduleProps }) => Promise<ResponseAPIProps>
    deleteRestaurant: ({ id }: { id: number }) => Promise<ResponseAPIProps>
    deleteSchedule: ({ id }: { id: number }) => Promise<ResponseAPIProps>
    createSchedule: ({
        schedule,
        restaurantId,
    }: {
        schedule: ScheduleProps
        restaurantId: number
    }) => Promise<ResponseAPIProps>
    register: (props: {
        name: string
        username: string
        password: string
        role: string
    }) => Promise<ResponseAPIProps>
}

export type FetchApiProps = (props: AxiosInstance) => FetcherApi
