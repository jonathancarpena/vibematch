import ENDPOINTS from '@/lib/endpoints'
import { redirect } from 'next/navigation'
import { TopTracks, TopArtists, UserProfile, TopGenre } from '@/lib/types'
import Navbar from '@/components/Layout/Navbar'
import Container from '@/components/Layout/Container'

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
                <section className="text-black ">
                    <h1>{profile.display_name}</h1>
                </section>

                {/* Genres */}
                <section className="text-black ">
                    <h1>Top Genres</h1>
                </section>

                {/* Tracks */}
                <section className="text-black ">
                    <h1>{profile.display_name}</h1>
                </section>

                {/* Artists */}
                <section className="text-black ">
                    <h1>{profile.display_name}</h1>
                </section>
            </Container>
        </>
    )
}
