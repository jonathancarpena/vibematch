import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import endpoints from '@/lib/endpoints'
import {
    TopTracks,
    TopArtists,
    UserProfile,
    TopGenre,
    PlayHistory,
} from '@/lib/types'

interface DataResponse {
    tracks: TopTracks
    artists: TopArtists
    genres: TopGenre
    recentlyPlayed: PlayHistory[]
    profile: UserProfile
}

async function getData(): Promise<DataResponse> {
    const code = cookies().get('code')?.value
    const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

    const res = await fetch(`${BASE}/users`, {
        method: 'POST',
        body: JSON.stringify(code),
    })

    const { data, error } = await res.json()

    if (error === 401) {
        redirect(endpoints.login)
    } else if (error > 400) {
        redirect('/')
    }
    return data
}

export default async function DashboardPage() {
    const { tracks, artists, genres, profile, recentlyPlayed } = await getData()
    console.log(profile)
    return <h1>Congrats</h1>
}
