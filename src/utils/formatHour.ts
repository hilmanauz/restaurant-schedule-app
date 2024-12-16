export function formatHour(hours: string) {
    let hr = Number(hours.split(':')[0])
    let min = hours.split(':')[1]
    if (Number(min) < 10 && Number(min) !== 0) {
        min = '0' + min
    }
    let ampm = ' AM'
    if (hr > 12) {
        hr -= 12
        ampm = ' PM'
    }
    return hr + ':' + min + ampm
}
