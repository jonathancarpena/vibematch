import ENDPOINTS from '@/lib/endpoints'
import { redirect } from 'next/navigation'
import { VibeMatchUser } from '@/lib/types'
import Navbar from '@/components/Layout/Navbar'
import Container from '@/components/Layout/Container'

import Dashboard from '@/components/Callback/Dashboard'
import UserProfile from '@/components/Callback/UserProfile'

interface Props {
    searchParams: {
        code: string
    }
}

async function getData(code: string): Promise<VibeMatchUser> {
    const BASE = process.env.NEXT_PUBLIC_BASE_URL

    const res = await fetch(`${BASE}/api/login`, {
        method: 'POST',
        body: JSON.stringify(code),
    })

    const {
        data: { response },
        error,
    } = await res.json()
    if (error === 401) {
        redirect(ENDPOINTS.login)
    } else if (error > 400) {
        redirect('/')
    }
    return response
}

async function getUsers() {
    const BASE = process.env.NEXT_PUBLIC_BASE_URL

    const res = await fetch(`${BASE}/api/users`, {
        method: 'GET',
    })

    const users = await res.json()

    return users
}

export default async function Home({ searchParams }: Props) {
    const { profile, tracks, genres, artists, timestamp, recentlyPlayed } =
        await getData(searchParams.code)

    const res = await getUsers()

    return (
        <>
            <Navbar users={res.data} />
            <Container>
                <UserProfile profile={profile} timestamp={timestamp} />
                <Dashboard
                    tracks={tracks}
                    genres={genres}
                    artists={artists}
                    recentlyPlayed={recentlyPlayed}
                />
            </Container>
        </>
    )
}
