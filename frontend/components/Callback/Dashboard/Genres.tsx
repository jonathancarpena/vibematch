import { Genre } from '@/lib/types'
import React from 'react'
import { TimeRangePlaceholders } from '.'

interface Props {
    term: any
    genres: Genre
}

function Genres({ genres, term }: Props) {
    return (
        <section className="mb-12 ">
            <h2 className="font-bold text-2xl md:text-3xl">Top Genres</h2>
            <p className="text-secondary font-medium text-sm">
                Your top generes{' '}
                {`${
                    term === 'longTerm'
                        ? ''
                        : `from the past ${TimeRangePlaceholders[term]}`
                }`}
            </p>

            {Object.entries(genres).length ? (
                <ol className="flex overflow-x-scroll space-x-3 h-max py-2.5">
                    {Object.entries(genres).map((item, index) => (
                        <li
                            key={`${term}-genre-${index}`}
                            className="text-sm bg-neutral-100 flex space-x-1 py-2 px-4 rounded-full"
                        >
                            <span className="w-max">{item[0]}</span>
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-center text-sm font-semibold text-secondary py-2.5">
                    Not enough data to complete this list
                </p>
            )}
        </section>
    )
}

export default Genres
