'use client'
import { LoadingOverlay, Pagination } from '@/components/atoms'
import React from 'react'
import useSWR, { mutate } from 'swr'
import { useFetchApi } from '@/providers/fetch-api-provider'
import { useQueryParams } from '@/hooks/useQueryParams'
import { CreateUpdateRestaurantModal, RestaurantCard } from '@/components/moleculs'
import { RestaurantProps, ScheduleProps } from './restaurants-list.types'
import { DataFetcherResult } from '@/lib/fetch-api-client/types'
import { useDisclosure } from '@mantine/hooks'
import { CreateUpdateRestaurantProps } from '@/components/moleculs/create-update-restaurant-modal/create-update-restaurant.-modaltypes'
import { differenceBy, differenceWith, isEqual } from 'lodash'

export function RestaurantsList() {
    const client = useFetchApi()
    const { queryParams, setQueryParams } = useQueryParams()
    const [opened, { close, open }] = useDisclosure()
    const [selectedRestaurant, setSelectedRestaurant] = React.useState<RestaurantProps>()
    const [restaurantData, setRestaurantData] = React.useState<{
        data: Array<RestaurantProps>
        total: number
    }>()
    const page = Number(queryParams.get('page')) || 1
    const date = queryParams.get('date')
    const time = queryParams.get('time')

    const { data, isLoading } = useSWR(
        ['/restaurants', page, date, time],
        async ([api, page, date, time]) => {
            const data = await client.getData<DataFetcherResult<Array<RestaurantProps>>>(
                api +
                    `?page=${page}` +
                    (date ? `&date=${date}` : '') +
                    (time ? `&time=${time}` : '')
            )

            return data?.data
        }
    )

    React.useEffect(() => {
        if (!selectedRestaurant) return
        open()
    }, [selectedRestaurant])

    React.useEffect(() => {
        if (!data) return
        setRestaurantData({
            data: data.data,
            total: data.meta.last_page,
        })
    }, [data])

    const handleSubmitUpdateRestaurantSchedule: CreateUpdateRestaurantProps['submitForm'] =
        React.useCallback(
            (values, fetchData) => {
                if (!selectedRestaurant) return
                fetchData({
                    promise: async () => {
                        const fetchData = []
                        const schedules = values.schedules as Array<ScheduleProps>
                        const isRestaurantNameSimilar = isEqual(
                            values.name,
                            selectedRestaurant.name
                        )
                        if (!isRestaurantNameSimilar)
                            fetchData.push(
                                client.updateRestaurant({ id: values.id, name: values.name })
                            )
                        const newData = differenceBy(schedules, selectedRestaurant.schedules, 'id')
                        newData.length &&
                            newData.forEach((item) => {
                                fetchData.push(
                                    client.createSchedule({
                                        schedule: item,
                                        restaurantId: selectedRestaurant.id,
                                    })
                                )
                            })
                        selectedRestaurant.schedules.forEach((item) => {
                            const isExistData = schedules.find(
                                (el) => el.day_of_week === item.day_of_week
                            )
                            if (isExistData) {
                                const close_time = isExistData.close_time.split(':')
                                const open_time = isExistData.open_time.split(':')
                                close_time.length > 2 && close_time.pop()
                                open_time.length > 2 && open_time.pop()
                                !isEqual(isExistData, item) &&
                                    fetchData.push(
                                        client.updateSchedule({
                                            schedule: {
                                                ...isExistData,
                                                close_time: close_time.join(':'),
                                                open_time: open_time.join(':'),
                                                day_of_week: isExistData.day_of_week.toLowerCase(),
                                            },
                                        })
                                    )
                            } else {
                                fetchData.push(client.deleteSchedule({ id: item.id }))
                            }
                        })
                        return Promise.allSettled(fetchData)
                    },
                    success: {
                        title: 'Success Update!',
                        desc: 'Data has been updated',
                    },
                    onClose: async () => {
                        await mutate(['/restaurants', page, date, time])
                        close()
                        setSelectedRestaurant(undefined)
                    },
                })
            },
            [selectedRestaurant, page, date, time]
        )

    return (
        <div className="container mx-auto flex flex-col items-center gap-y-5 col-span-3 relative">
            <LoadingOverlay visible={isLoading} overlayOpacity={0.5} />
            {restaurantData?.data.map((item) => (
                <RestaurantCard
                    key={`${item.id}-${item.name}`}
                    item={item}
                    setSelectedRestaurant={setSelectedRestaurant}
                />
            ))}
            <CreateUpdateRestaurantModal
                close={() => {
                    close()
                    setSelectedRestaurant(undefined)
                }}
                opened={opened}
                title={'Update restaurant schedule'}
                submitLabel="Update"
                data={selectedRestaurant}
                submitForm={handleSubmitUpdateRestaurantSchedule}
            />
            <Pagination
                value={page}
                total={restaurantData?.total || 0}
                className="pt-8 mt-auto"
                onChange={(val) => {
                    setQueryParams({
                        page: val,
                    })
                }}
            />
        </div>
    )
}
