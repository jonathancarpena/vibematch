import { RecentlyPlayed as PlayHistory } from '@/lib/types'
import Image from 'next/image'
import React from 'react'
import { formatDateToMMDYYYY } from '@/lib/utils'
import Link from 'next/link'

interface Props {
    tracks: PlayHistory
}

function RecentlyPlayed({ tracks }: Props) {
    return (
        <section className="mb-12 ">
            <h2 className="font-bold text-2xl md:text-3xl">Recent streams</h2>
            <p className="text-secondary font-medium text-sm">
                Your recently played tracks
            </p>
            <ol>
                {Object.entries(tracks).map((item) => (
                    <li key={`recent-streams-${item[0]}`}>
                        <h3 className="mt-4 mb-2 font-semibold text-secondary">
                            {formatDateToMMDYYYY(item[0])}
                        </h3>
                        <ol>
                            {item[1].map((track, index) => (
                                <li key={index}>
                                    <Link
                                        href={`https://open.spotify.com/track/${
                                            track.id.split('-VibeMatch-')[1]
                                        }`}
                                        target="_blank"
                                        className="flex justify-between  py-2 border-b"
                                    >
                                        <div className="flex w-10/12">
                                            {/* Image */}
                                            <div className="relative min-w-12 h-12 w-max">
                                                <Image
                                                    src={track.image.url}
                                                    alt={`${track.name} album`}
                                                    fill
                                                    sizes="48px"
                                                    style={{
                                                        objectFit: 'cover',
                                                        objectPosition:
                                                            'center',
                                                    }}
                                                />
                                            </div>

                                            {/* Track Name, Artist */}
                                            <div className="ml-3 w-9/12 truncate leading-tight">
                                                <p className="font-bold truncate">
                                                    {track.name}
                                                </p>
                                                <p className="font-medium text-secondary truncate">
                                                    {track.artist}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="text-xs font-medium text-secondary w-max text-right">
                                            {track.timePlayed}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </li>
                ))}
            </ol>
        </section>
    )
}

export default RecentlyPlayed
