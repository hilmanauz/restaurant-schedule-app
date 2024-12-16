'use client'
import { Button, Card, Heading, Modal, Text } from '@/components/atoms'
import { CreateUpdateRestaurantModal } from '@/components/moleculs'
import { CreateUpdateRestaurantProps } from '@/components/moleculs/create-update-restaurant-modal/create-update-restaurant.-modaltypes'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useFetchApi } from '@/providers/fetch-api-provider'
import { ActionIcon } from '@mantine/core'
import { DateInput, TimeInput } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { BsClock, BsFilterSquare } from 'react-icons/bs'
import { mutate } from 'swr'
import { ScheduleProps } from '../restaurants-list/restaurants-list.types'

export function FilterBar() {
    const { queryParams, setQueryParams, removeQueryParams } = useQueryParams()
    const { data } = useSession()
    const client = useFetchApi()
    const page = Number(queryParams.get('page')) || 1
    const date = queryParams.get('date')
    const time = queryParams.get('time')
    const [timeInput, setTimeInput] = React.useState<string | null>(null)
    const [dateInput, setDateInput] = React.useState<string | null>(null)
    const ref = React.useRef<HTMLInputElement>(null)
    const [opened, { open, close }] = useDisclosure(false)

    React.useEffect(() => {
        setTimeInput(time)
        setDateInput(date)
    }, [date, time])

    const handleApplyFilter = React.useCallback(() => {
        dateInput
            ? setQueryParams({
                  date: dateInput,
              })
            : removeQueryParams(['date'])
        timeInput
            ? setQueryParams({
                  time: timeInput,
              })
            : removeQueryParams(['time'])
        setQueryParams({
            page: 1,
        })
    }, [timeInput, dateInput])

    const handleSubmitCreateRestaurantSchedule: CreateUpdateRestaurantProps['submitForm'] =
        React.useCallback(
            async (values, fetchData) => {
                const data = await client.createRestaurant({ name: values.name })
                {
                    values.schedules?.length &&
                        (await fetchData({
                            promise: async () => {
                                const schedulesData = values.schedules as Array<ScheduleProps>
                                const fetchSchedules = schedulesData.map(
                                    async (item: ScheduleProps) =>
                                        client.createSchedule({
                                            restaurantId: data?.data.id,
                                            schedule: item,
                                        })
                                )
                                return Promise.allSettled(fetchSchedules)
                            },
                            success: {
                                desc: 'Schedule has been added to this restaurant',
                                title: 'Success Create Restaurant!',
                            },
                            onClose: async () => {
                                await mutate(['/restaurants', page, date, time])
                                close()
                            },
                        }))
                }
            },
            [page, date, time]
        )
    return (
        <div className="gap-4 md:col-span-1 space-y-5">
            {data?.user.role === 'admin' && (
                <>
                    <Button
                        fullWidth
                        variant="filled"
                        size="md"
                        color="blue"
                        onClick={open}
                        leftIcon={<BiPlus size={20} />}
                    >
                        Create Restaurant Schedule
                    </Button>
                    <CreateUpdateRestaurantModal
                        close={close}
                        opened={opened}
                        title={'Create restaurant schedule'}
                        submitLabel="Create"
                        submitForm={handleSubmitCreateRestaurantSchedule}
                    />
                </>
            )}
            <Card className="h-min">
                <form
                    className="mb-2"
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleApplyFilter()
                    }}
                >
                    <div className="flex gap-x-2 items-center">
                        <BsFilterSquare size={20} />
                        <Heading order={3}>Filter</Heading>
                    </div>
                    <div>
                        <div className="flex gap-x-2">
                            <DateInput
                                value={dateInput ? new Date(dateInput) : null}
                                onChange={(val) => {
                                    setDateInput(val ? dayjs(val).format('YYYY-MM-DD') : null)
                                }}
                                className="grow"
                                valueFormat="ddd, MMMM DD YYYY"
                                label="Date"
                                placeholder="Date input"
                                popoverProps={{
                                    withinPortal: true,
                                }}
                                clearable
                            />
                            <TimeInput
                                label="Time"
                                ref={ref}
                                value={timeInput !== null ? timeInput : undefined}
                                onChange={(e) => {
                                    setTimeInput(e.currentTarget.value)
                                }}
                                rightSection={
                                    <ActionIcon
                                        onClick={() => {
                                            ref.current?.showPicker()
                                        }}
                                    >
                                        <BsClock size="1rem" stroke={'1.5'} />
                                    </ActionIcon>
                                }
                                maw={400}
                                mx="auto"
                            />
                        </div>
                        <Button fullWidth type="submit" variant="outline" color="blue" mt={'md'}>
                            Apply
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
