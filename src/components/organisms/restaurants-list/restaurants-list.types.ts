export type RestaurantProps = {
    id: number
    name: string
    schedules: Array<ScheduleProps>
}

export type ScheduleProps = {
    id: number
    day_of_week: string
    open_time: string
    close_time: string
}
