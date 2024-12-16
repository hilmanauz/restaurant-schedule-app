import { RestaurantProps } from '@/components/organisms/restaurants-list/restaurants-list.types'

export type RestaurantCardProps = {
    item: RestaurantProps
    setSelectedRestaurant: React.Dispatch<React.SetStateAction<RestaurantProps | undefined>>
}
