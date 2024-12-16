import { FetchDataProps } from '@/hooks/useFetchData/types'

export type CreateUpdateRestaurantProps = {
    opened: boolean
    close: () => void
    data?: Record<string, any>
    isEnterSubmit?: boolean
    submitForm: (
        values: Record<string, any>,
        fetchData: FetchDataProps['fetchData']
    ) => Promise<void> | void
    hideSubmitButton?: boolean
    submitLabel?: string
    cancelButton?: boolean
    title?: React.ReactNode
}
