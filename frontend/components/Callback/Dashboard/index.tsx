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
import Genres from './Genres'
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

            <Genres genres={genres[term]} term={term} />
            <Tracks tracks={tracks[term]} term={term} />
            <Artists artists={artists[term]} term={term} />
        </>
    )
}

export default Dashboard
