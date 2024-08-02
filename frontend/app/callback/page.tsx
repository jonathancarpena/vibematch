import ENDPOINTS from '@/lib/endpoints'
import { redirect } from 'next/navigation'
import {
    TopTracks,
    TopArtists,
    UserProfile as SpotifyUser,
    TopGenre,
} from '@/lib/types'
import Navbar from '@/components/Layout/Navbar'
import Container from '@/components/Layout/Container'
import Image from 'next/image'
import { User, ExternalLink } from 'react-feather'
import Link from 'next/link'
import Dashboard from '@/components/Callback/Dashboard'
import UserProfile from '@/components/Callback/UserProfile'

interface DataResponse {
    data: {
        tracks: TopTracks
        artists: TopArtists
        genres: TopGenre
        profile: SpotifyUser
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
        data: { profile, tracks, genres, artists, timestamp },
    } = await getData(searchParams.code)

    return (
        <>
            <Navbar />
            <Container>
                <UserProfile profile={profile} timestamp={timestamp} />
                <Dashboard tracks={tracks} genres={genres} artists={artists} />
            </Container>
        </>
    )
}
