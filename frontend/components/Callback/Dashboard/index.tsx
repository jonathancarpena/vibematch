'use client'
import { useState } from 'react'
import {
    TopTracks,
    TopArtists,
    TopGenre,
    TimeRanges,
    TimeRangePlaceholder,
} from '@/lib/types'
import Dropdown from './Dropdown'
import Tracks from './Tracks'
import Artists from './Artists'

interface Props {
    tracks: TopTracks
    artists: TopArtists
    genres: TopGenre
}

export const TimeRangePlaceholders: TimeRangePlaceholder = {
    shortTerm: '4 weeks',
    mediumTerm: '6 months',
    longTerm: 'lifetime',
}
function Dashboard({ genres, tracks, artists }: Props) {
    const [term, setTerm] = useState<TimeRanges>('shortTerm')

    const handleOnClick = (value: TimeRanges) => setTerm(value)

    return (
        <>
            {/* Term Select */}
            <Dropdown
                sx="mx-auto md:mr-0 my-10 md:my-6"
                value={term}
                onClick={handleOnClick}
                options={['shortTerm', 'mediumTerm', 'longTerm']}
            />
            {/* Genres */}
            <section className="mb-12">
                <h2 className="font-bold text-2xl md:text-3xl">Top Genres</h2>
                <p className="text-secondary font-medium text-sm">
                    Your top generes{' '}
                    {`${
                        term === 'longTerm'
                            ? ''
                            : `from the past ${TimeRangePlaceholders[term]}`
                    }`}
                </p>

                {Object.entries(genres[term]).length ? (
                    <ol className="flex overflow-x-scroll space-x-3 h-max py-2.5">
                        {Object.entries(genres[term]).map((item, index) => (
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

            {/* Tracks */}
            <Tracks tracks={tracks[term]} term={term} />

            {/* Artists */}
            <Artists artists={artists[term]} term={term} />
        </>
    )
}

export default Dashboard
