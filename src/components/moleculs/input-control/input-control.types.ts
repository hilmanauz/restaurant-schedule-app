import { InputRules } from '@/components/atoms/form-control/form-control.types'
import { MantineNumberSize, MantineSize } from '@mantine/core'
import { Control, FieldValues, UseFormClearErrors, UseFormReturn } from 'react-hook-form'
import { PasswordInputProps } from '@/components/atoms/password-input/password-input.types'
import React from 'react'
import { SelectProps } from '@/components/atoms/select/select.types'
import { TextInputProps } from '@/components/atoms/text-input/text-input.types'
import { TimeInputProps } from '@/components/atoms/time-input/time-input.types'

export type InputType = 'text' | 'password' | 'select' | 'repassword' | 'time'

export type InputControlProps<T extends FieldValues, I extends InputType> = {
    control: Control<T, any>
    name: string
    leftIcon?: React.ReactNode
    onKeyDown?: React.KeyboardEventHandler<
        HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | HTMLDivElement
    >
    onChange?: (
        e: any,
        onChange: (...event: any[]) => void,
        methods: UseFormReturn<FieldValues, any, FieldValues>
    ) => void
    onBlur?: () => void
    onFocus?: () => void
    radius?: MantineNumberSize
    classNames?: Record<string, string>
    size?: MantineSize
    readOnly?: boolean
} & InputProps<I>

export type FormDefinition<
    T extends InputType,
    U extends Record<string, any> = Record<string, any>
> = {
    type: T
    options: U
    leftIcon?: React.ReactNode
    placeholder?: string
    rules?: InputRules
    required?: boolean | { message: string }
    readOnly?: boolean
    disabled?: boolean
    onChange?: (
        e: any,
        onChange: (...event: any[]) => void,
        methods: UseFormReturn<FieldValues, any, FieldValues>
    ) => void
    label?: React.ReactNode
}

export type InputProps<T extends InputType = InputType> = T extends 'text'
    ? FormDefinition<
          T,
          (
              | { format: 'string' }
              | { format: 'number' }
              | { format: 'email' }
              | {
                    format: 'url-link'
                }
          ) &
              TextInputProps
      >
    : T extends 'select'
    ? FormDefinition<
          T,
          Omit<SelectProps, 'data'> & {
              data: Array<{ label: string; value: any }>
              withinPortal?: boolean
          }
      >
    : T extends 'password'
    ? FormDefinition<T, PasswordInputProps>
    : T extends 'repassword'
    ? FormDefinition<T, PasswordInputProps>
    : T extends 'time'
    ? FormDefinition<T, TimeInputProps>
    : FormDefinition<T, {}>

export type InputPropsValues<T extends InputType> = T extends
    | 'text'
    | 'rich-text'
    | 'textarea'
    | 'select'
    | 'async-select'
    | 'password'
    | 'file'
    ? string
    : T extends 'switch'
    ? boolean
    : T extends 'number'
    ? number
    : never
