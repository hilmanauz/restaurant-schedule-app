export const isTimeInRange = (queryTime: string, openTime: string, closeTime: string) => {
    const [queryH, queryM] = queryTime.split(':').map(Number)
    const [openH, openM] = openTime.split(':').map(Number)
    const [closeH, closeM] = closeTime.split(':').map(Number)

    const queryDate = new Date(0, 0, 0, queryH, queryM) // Tanggal dummy
    const openDate = new Date(0, 0, 0, openH, openM)
    const closeDate = new Date(0, 0, 0, closeH, closeM)

    // Jika closeTime melewati tengah malam
    if (closeDate < openDate) {
        return queryDate >= openDate || queryDate <= closeDate
    }

    return queryDate >= openDate && queryDate <= closeDate
}
