import React, { memo } from 'react'
import { TimeInputProps } from './time-input.types'
import { TimeInput as MantineTimeInput } from '@mantine/dates'
import { ActionIcon } from '@mantine/core'
import { BsClock } from 'react-icons/bs'

const TimeInputComponent = ({ id, ...props }: TimeInputProps): JSX.Element => {
    const ref = React.useRef<HTMLInputElement>(null)
    return (
        <MantineTimeInput
            {...props}
            id={id}
            ref={ref}
            rightSection={
                <ActionIcon
                    onClick={() => {
                        ref.current?.showPicker()
                    }}
                >
                    <BsClock size="1rem" stroke={'1.5'} />
                </ActionIcon>
            }
        />
    )
}

export const TimeInput = memo(TimeInputComponent)
