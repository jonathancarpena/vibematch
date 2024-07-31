import ENDPOINTS from '@/lib/endpoints'
import { redirect } from 'next/navigation'
import { TopTracks, TopArtists, UserProfile, TopGenre } from '@/lib/types'

interface DataResponse {
    tracks: TopTracks
    artists: TopArtists
    genres: TopGenre
    profile: UserProfile
    timestamp: Date
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
    const data = await getData(searchParams.code)

    return (
        <main className="">
            <h1>CALLBACK</h1>
        </main>
    )
}
