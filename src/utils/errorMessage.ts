export const handleErrorMessage = (error: unknown) =>
    typeof error === 'string'
        ? error.toUpperCase()
        : error instanceof Error
        ? // @ts-ignore
          (error.response?.data.errors
              ? // @ts-ignore
                Object.values(error.response?.data.errors).join(', ')
              : undefined) || error.message
        : ''
