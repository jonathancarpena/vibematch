'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import ENDPOINTS from '@/lib/endpoints'

export default function Home() {
    const query = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const code = query.get('code')

        if (code) {
            const userLogin = async () => {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(code),
                })
                const { ok } = await res.json()
            }
            userLogin()
        }
    }, [query, router])
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
