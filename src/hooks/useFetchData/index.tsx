import { handleErrorMessage } from '@/utils'
import { notifications } from '@mantine/notifications'
import React from 'react'
import { AiOutlineCheck, AiOutlineWarning } from 'react-icons/ai'
import { LoadingOverlay } from '@/components/atoms'
import { FetchDataProps } from './types'
import { ResponseAPIProps } from '@/lib/fetch-api-client/types'
import { isArray } from 'lodash'

const successNotification = (success: { title: string; desc: string }) => {
    notifications.show({
        title: success.title,
        icon: <AiOutlineCheck />,
        withBorder: true,
        message: success.desc,
        autoClose: 1000,
    })
}

const errorNotification = (error: unknown) => {
    notifications.show({
        message: handleErrorMessage(error),
        title: 'Error',
        color: 'red',
        withBorder: true,
        icon: <AiOutlineWarning />,
        autoClose: 4000,
    })
}

export function useFetchData(): FetchDataProps {
    const [loading, setLoading] = React.useState(false)

    const fetchData = async ({
        promise,
        onClose,
        onError,
        success,
    }: {
        promise: () =>
            | Promise<void>
            | Promise<ResponseAPIProps>
            | Promise<PromiseSettledResult<ResponseAPIProps>[]>
        onClose?: (res: ResponseAPIProps | PromiseSettledResult<ResponseAPIProps>[] | void) => void
        onError?: (idx?: number) => void
        success?: {
            oneAlert?: boolean
            title: string
            desc: string
        }
    }) => {
        setLoading(true)

        try {
            notifications.clean()
            const result = await promise()
            if (isArray(result)) {
                let isSuccess = true
                result.forEach((val, idx) => {
                    if (val.status === 'fulfilled') {
                        success && !success.oneAlert && successNotification(success)
                    } else if (val.status === 'rejected') {
                        isSuccess = false
                        onError?.(idx)
                        errorNotification(val.reason)
                    }
                })
                success && success.oneAlert && isSuccess && successNotification(success)
            } else {
                success && successNotification(success)
            }

            onClose?.(result)
            setLoading(false)
            return result
        } catch (error) {
            setLoading(false)
            onError?.()
            errorNotification(error)
        }
    }

    return {
        loading,
        // @ts-ignore
        fetchData,
        LoadingCover: () => <LoadingOverlay visible={loading} zIndex={1000} overlayBlur={2} />,
    }
}
