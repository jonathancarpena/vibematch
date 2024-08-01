import ENDPOINTS from '@/lib/endpoints'
import { redirect } from 'next/navigation'
import { TopTracks, TopArtists, UserProfile, TopGenre } from '@/lib/types'
import Navbar from '@/components/Layout/Navbar'
import Container from '@/components/Layout/Container'
import Image from 'next/image'
import { User, ExternalLink } from 'react-feather'
import Link from 'next/link'
import Dashboard from '@/components/Callback/Dashboard'

interface DataResponse {
    data: {
        tracks: TopTracks
        artists: TopArtists
        genres: TopGenre
        profile: UserProfile
        timestamp: Date
    }
    error: string
}

interface Props {
    searchParams: {
        code: string
    }
}

async function getData(code: string): Promise<DataResponse> {
    const BASE = process.env.NEXT_PUBLIC_BASE_URL

    const res = await fetch(`${BASE}/api/login`, {
        method: 'POST',
        body: JSON.stringify(code),
    })

    const { data, error } = await res.json()

    if (error === 401) {
        redirect(ENDPOINTS.login)
    } else if (error > 400) {
        redirect('/')
    }
    return data
}

export default async function Home({ searchParams }: Props) {
    const {
        data: { profile, tracks, genres, artists },
    } = await getData(searchParams.code)

    return (
        <>
            <Navbar />
            <Container>
                {/* User Profile */}
                <section className="flex flex-col items-center pt-24 pb-14 lg:flex-row">
                    {/* Profile Image */}
                    <div
                        className={`rounded-full w-52 h-52 relative overflow-hidden ${
                            profile.images.length
                                ? 'ring-white'
                                : 'ring-[#808080]'
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
                            <span className="text-sm  mb-2">
                                {profile.followers.total} followers
                            </span>

                            <Link
                                href={profile.external_urls.spotify}
                                target="_blank"
                            >
                                <span className="  hover:text-accent transition duration-150 text-center">
                                    <ExternalLink size={24} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                <Dashboard tracks={tracks} genres={genres} artists={artists} />
            </Container>
        </>
    )
}
