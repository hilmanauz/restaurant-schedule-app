import React from 'react'
import { RestaurantCardProps } from './restaurant-card.types'
import { Collapse, Menu, Text } from '@/components/atoms'
import { BiArrowFromLeft, BiArrowToBottom, BiChevronDown, BiTrash } from 'react-icons/bi'
import { formatHour } from '@/utils/formatHour'
import { useDisclosure } from '@mantine/hooks'
import { classNames, isTimeInRange } from '@/utils'
import { MdDoubleArrow, MdUpdate } from 'react-icons/md'
import dayjs from 'dayjs'
import { useQueryParams } from '@/hooks/useQueryParams'
import { ScheduleProps } from '@/components/organisms/restaurants-list/restaurants-list.types'
import { ActionIcon, Loader } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { useFetchData } from '@/hooks/useFetchData'
import { useFetchApi } from '@/providers/fetch-api-provider'
import { mutate } from 'swr'
import { BsArrowRight, BsClockFill, BsThreeDotsVertical } from 'react-icons/bs'

const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
export const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export function RestaurantCard({ item, setSelectedRestaurant }: RestaurantCardProps) {
    const { fetchData, loading } = useFetchData()
    const client = useFetchApi()
    const { data } = useSession()
    const { queryParams } = useQueryParams()
    const page = Number(queryParams.get('page')) || 1
    const date = queryParams.get('date')
    const time = queryParams.get('time')
    const day = React.useMemo(
        () =>
            item.schedules.find((el) => days[new Date().getDay()] === el.day_of_week.toLowerCase()),
        [item.schedules]
    )
    const [opened, { toggle }] = useDisclosure(false)
    const isHighlight = (time: string | null, date: string | null, el: ScheduleProps) => {
        if (time && date) {
            return (
                el.day_of_week === dayjs(date).format('ddd') &&
                isTimeInRange(time, el.open_time, el.close_time)
            )
        } else if (time) {
            return isTimeInRange(time, el.open_time, el.close_time)
        } else if (date) {
            return el.day_of_week === dayjs(date).format('ddd')
        } else {
            return el.day_of_week === day?.day_of_week
        }
    }

    const filterSchedule = React.useMemo(() => {
        if (!date && !time) return
        return item.schedules.filter((el) => isHighlight(time, date, el))
    }, [item.schedules, date, time])

    return (
        <div className="transition-all rounded-lg bg-white hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-md border-2 w-full">
            <div className="px-5 py-3 flex gap-x-4 justify-between" onClick={toggle}>
                <div className="flex gap-x-1 items-center w-[50%] lg:w-fit">
                    {data?.user.role === 'admin' && (
                        <Menu shadow="md" withinPortal withArrow>
                            <Menu.Target>
                                <ActionIcon
                                    loading={loading}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                >
                                    <BsThreeDotsVertical size="1rem" stroke={'1.5'} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item
                                    icon={<MdUpdate size="1rem" stroke={'1.5'} />}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setSelectedRestaurant(item)
                                    }}
                                >
                                    Update
                                </Menu.Item>
                                <Menu.Item
                                    color="red"
                                    icon={
                                        loading ? (
                                            <Loader />
                                        ) : (
                                            <BiTrash size="1rem" stroke={'1.5'} />
                                        )
                                    }
                                    disabled={loading}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        fetchData({
                                            promise: async () => {
                                                return client.deleteRestaurant({ id: item.id })
                                            },
                                            onClose: async () => {
                                                await mutate(['/restaurants', page, date, time])
                                            },
                                            success: {
                                                title: 'Delete successfully!',
                                                desc: `${item.name} has been removed`,
                                            },
                                        })
                                    }}
                                >
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    )}
                    <Text fw={'bold'} fz="13px">
                        {item.name}
                    </Text>
                    <div
                        className={classNames(
                            'transform transition ml-auto',
                            !opened ? 'rotate-0' : 'rotate-180'
                        )}
                    >
                        <BiChevronDown size={20} />
                    </div>
                </div>
                <Text className="flex flex-col lg:flex-row items-center gap-x-1" fz="11px">
                    {date
                        ? dayjs(date).format('ddd')
                        : time
                        ? filterSchedule?.map((el) => el.day_of_week).join(', ')
                        : 'Today'}{' '}
                    <BiArrowFromLeft className="hidden lg:flex" />{' '}
                    <Text fw={'bold'}>
                        {date && filterSchedule?.length ? (
                            `${formatHour(filterSchedule[0].open_time)} - ${formatHour(
                                filterSchedule[0].close_time
                            )}`
                        ) : time ? (
                            formatHour(time)
                        ) : day ? (
                            `${formatHour(day.open_time)} - ${formatHour(day.close_time)}`
                        ) : (
                            <Text fw={'bold'} underline>
                                Close
                            </Text>
                        )}
                    </Text>
                </Text>
            </div>
            <Collapse in={opened}>
                <div className="px-5 pb-3 pt-1 grid lg:grid-cols-none lg:grid-flow-col lg:auto-cols-auto lg:gap-x-4 gap-y-2 lg:gap-y-0">
                    {item.schedules.map((el, idx) => (
                        <div
                            className={classNames(
                                'py-2 px-4 flex justify-between lg:flex-col rounded-md border lg:text-center',
                                isHighlight(time, date, el) && 'outline outline-blue-500'
                            )}
                            key={idx}
                        >
                            <Text fz="base" fw={'bold'}>
                                {el.day_of_week}
                            </Text>

                            <div className="lg:gap-y-2 lg:gap-x-0.5 gap-x-2 flex lg:flex-col items-center">
                                <Text fz="xs">{formatHour(el.open_time)}</Text>
                                <div className="animate-bounce hidden lg:flex">
                                    <MdDoubleArrow className="rotate-90 " />
                                </div>
                                <div className="flex lg:hidden">
                                    <BsArrowRight size={12} />
                                </div>
                                <Text fz="xs">{formatHour(el.close_time)}</Text>
                            </div>
                        </div>
                    ))}
                </div>
            </Collapse>
        </div>
    )
}
