import { FilterBar, RestaurantsList } from '@/components/organisms'
import { Home } from '@/components/templates'
import React from 'react'

export default async function HomePage() {
    return <Home FilterBar={<FilterBar />} ListRestaurantPage={<RestaurantsList />} />
}
