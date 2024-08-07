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

interface DataResponse {
    response: VibeMatchUser
    allUsers: []
}

async function getData(code: string): Promise<DataResponse> {
    const BASE = process.env.NEXT_PUBLIC_BASE_URL

    const LOGIN_URL = `${BASE}/api/login`

    const res = await fetch(LOGIN_URL, {
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
        response: {
            profile,
            tracks,
            genres,
            artists,
            timestamp,
            recentlyPlayed,
        },
        allUsers,
    } = await getData(searchParams.code)

    return (
        <>
            <Navbar users={allUsers} />
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
