'use client'

import Link from 'next/link'
import ENDPOINTS from '@/lib/endpoints'

export default function Home() {
    return (
        <main className="">
            <h1>Tune Tracker</h1>
            <SpotifyLoginButton />
        </main>
    )
}

function SpotifyLoginButton() {
    return (
        <Link href={ENDPOINTS.login} className="">
            <button className="">Login</button>
        </Link>
    )
}
