import { Button, Menu, Modal, Text } from '@/components/atoms'
import React from 'react'
import { CreateUpdateRestaurantProps } from './create-update-restaurant.-modaltypes'
import { useFetchData } from '@/hooks/useFetchData'
import { useForm } from 'react-hook-form'
import { InputControl } from '../input-control/input-control.component'
import { ScheduleProps } from '@/components/organisms/restaurants-list/restaurants-list.types'
import { BiPlus, BiTrash } from 'react-icons/bi'
import { ActionIcon, Input } from '@mantine/core'
import { differenceBy } from 'lodash'
import { FaClock } from 'react-icons/fa'
import { TimeInput } from '@mantine/dates'
import { BsClock } from 'react-icons/bs'

const days = [
    { day_of_week: 'sun', label: 'Sunday' },
    {
        day_of_week: 'mon',
        label: 'Monday',
    },
    {
        day_of_week: 'tue',
        label: 'Tuesday',
    },
    {
        day_of_week: 'wed',
        label: 'Wednesday',
    },
    {
        day_of_week: 'thu',
        label: 'Thursday',
    },
    {
        day_of_week: 'fri',
        label: 'friday',
    },
    {
        day_of_week: 'sat',
        label: 'saturday',
    },
]

export function CreateUpdateRestaurantModal({
    close,
    opened,
    data,
    submitForm,
    title,
    submitLabel,
    isEnterSubmit,
}: CreateUpdateRestaurantProps) {
    const { LoadingCover, loading, fetchData } = useFetchData()

    const methods = useForm<Record<string, any>>()
    const schedules: Array<ScheduleProps> | undefined = methods.watch('schedules')

    React.useEffect(() => {
        opened && methods.reset(data)
    }, [data, opened])

    const handleCloseModal = React.useCallback(() => {
        close()
        setTimeout(() => {
            methods.reset()
            methods.clearErrors()
        }, 200)
    }, [close, , methods])
    const onSubmit = React.useCallback(
        async (value: Record<string, any>) => {
            try {
                await submitForm(value, fetchData)
                close()
            } catch (error) {}
        },
        [close, fetchData, submitForm]
    )

    const handleSubmit = React.useCallback(async () => {
        const isValid = await methods.trigger()

        if (isValid) {
            methods.handleSubmit(onSubmit)()
        }
    }, [methods, onSubmit])

    return (
        <Modal opened={opened} onClose={close} title={title} size={'lg'}>
            <form
                id={`modal-${title}`}
                name={`modal-${title}`}
                onKeyDown={
                    isEnterSubmit
                        ? (value) => {
                              if (value.key === 'Enter') {
                                  value.preventDefault()
                                  handleSubmit()
                              }
                          }
                        : undefined
                }
                className="flex flex-col gap-y-2 relative"
            >
                <LoadingCover />

                <InputControl
                    control={methods.control}
                    name="name"
                    type="text"
                    options={{ format: 'string' }}
                    label="Name"
                    required
                />
                <Input.Wrapper
                    id={'schedules'}
                    required
                    label={'Schedules'}
                    inputWrapperOrder={['label', 'input']}
                >
                    <div className="space-y-2">
                        {days
                            .filter((item) =>
                                schedules?.find(
                                    (el) => el.day_of_week.toLowerCase() === item.day_of_week
                                )
                            )
                            ?.map((item) => {
                                const scheduleIdx = schedules?.findIndex(
                                    (el) => el.day_of_week.toLowerCase() === item.day_of_week
                                )
                                return scheduleIdx !== undefined && scheduleIdx !== -1 ? (
                                    <div
                                        className="flex justify-between px-3 py-2 border rounded-md items-center"
                                        key={`${scheduleIdx}-${schedules?.[scheduleIdx].day_of_week}`}
                                    >
                                        <div className="flex gap-x-2 items-center">
                                            <ActionIcon
                                                onClick={() => {
                                                    schedules?.splice(scheduleIdx, 1)
                                                    methods.setValue('schedules', schedules)
                                                }}
                                                color="red"
                                            >
                                                <BiTrash size="1rem" stroke={'1.5'} />
                                            </ActionIcon>
                                            <Text tt={'capitalize'} fw={'bold'} fz="base">
                                                {item.label}
                                            </Text>
                                        </div>
                                        <div className="flex gap-x-2">
                                            <InputControl
                                                control={methods.control}
                                                name={`schedules.${scheduleIdx}.open_time`}
                                                type="time"
                                                options={{
                                                    label: 'Open time',
                                                    classNames: {
                                                        label: '!text-[11px]',
                                                    },
                                                    size: 'xs',
                                                    required: true,
                                                    maw: 400,
                                                    mx: 'auto',
                                                }}
                                                label="Open time"
                                                required={{
                                                    message: 'open time is required',
                                                }}
                                            />
                                            <InputControl
                                                control={methods.control}
                                                name={`schedules.${scheduleIdx}.close_time`}
                                                type="time"
                                                options={{
                                                    label: 'Open time',
                                                    classNames: {
                                                        label: '!text-[11px]',
                                                    },
                                                    size: 'xs',
                                                    required: true,
                                                    maw: 400,
                                                    mx: 'auto',
                                                }}
                                                label="Close time"
                                                required={{
                                                    message: 'close time is required',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )
                            })}
                        {schedules?.length !== 7 && (
                            <Menu shadow="md" width={150} withinPortal>
                                <Menu.Target>
                                    <Button leftIcon={<BiPlus />} variant="subtle" color="blue">
                                        Add Schedule
                                    </Button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    {differenceBy(
                                        days,
                                        (schedules || []).map((item) => ({
                                            ...item,
                                            day_of_week: item.day_of_week.toLowerCase(),
                                        })),
                                        'day_of_week'
                                    ).map((item) => (
                                        <Menu.Item
                                            onClick={() => {
                                                methods.setValue('schedules', [
                                                    ...(schedules || []),
                                                    {
                                                        day_of_week: item.day_of_week,
                                                        open_time: '00:00',
                                                        close_time: '23:00',
                                                    },
                                                ])
                                            }}
                                            tt={'capitalize'}
                                            ta={'center'}
                                        >
                                            {item.label}
                                        </Menu.Item>
                                    ))}
                                </Menu.Dropdown>
                            </Menu>
                        )}
                    </div>
                </Input.Wrapper>
                <div className={'flex gap-x-2 justify-between'}>
                    <Button
                        variant="outline"
                        onClick={handleCloseModal}
                        className="!mt-3"
                        loading={loading}
                        fullWidth
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="filled"
                        color="blue"
                        onClick={handleSubmit}
                        className="!mt-3"
                        loading={loading}
                        fullWidth
                    >
                        {submitLabel || 'Submit'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
