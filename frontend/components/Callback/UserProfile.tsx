import React from 'react'
import { User, ExternalLink } from 'react-feather'
import Image from 'next/image'
import { UserProfile as SpotifyUser } from '@/lib/types'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Props {
    profile: SpotifyUser
    timestamp: Date
}

function UserProfile({ profile, timestamp }: Props) {
    return (
        <section className="flex flex-col items-center pt-24 pb-14 lg:flex-row">
            {/* Profile Image */}
            <div
                className={`rounded-full w-52 h-52 relative overflow-hidden ${
                    profile.images.length ? 'ring-white' : 'ring-[#808080]'
                } ring-2  flex justify-center items-center lg:mr-6`}
            >
                {profile.images.length ? (
                    <Image
                        src={profile.images[1].url}
                        alt={`${profile.id}-profile-img`}
                        fill
                        sizes={'208px'}
                        priority
                    />
                ) : (
                    <User color="grey" size={52} />
                )}
            </div>

            <div className="flex flex-col space-y-2 justify-center items-center mt-3 text-center lg:text-start lg:items-start">
                <div>
                    <h2 className="font-bold text-2xl lg:text-3xl">
                        {profile.display_name}
                    </h2>
                    <h3 className="text-lg">@{profile.id}</h3>
                </div>

                <div className="flex flex-col justify-center items-center text-secondary lg:items-start">
                    <span className="text-sm mb-2">
                        {profile.followers.total} followers
                    </span>

                    <Link href={profile.external_urls.spotify} target="_blank">
                        <span className="  hover:text-accent transition duration-150 text-center mb-1 inline-block">
                            <ExternalLink size={24} />
                        </span>
                    </Link>
                    <span className="text-xs">
                        {`*Stats from ${formatDate(new Date(timestamp))}`}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default UserProfile
