import React from 'react'
import { HomeProps } from './home.type'

export function Home({ FilterBar, ListRestaurantPage }: HomeProps) {
    return (
        <>
            <section className="flex-1 py-8 flex flex-col">
                <div className="grid md:grid-cols-4 gap-8 px-4 md:gap-8 lg:px-6 flex-1">
                    {FilterBar}
                    {ListRestaurantPage}
                </div>
            </section>
        </>
    )
}
