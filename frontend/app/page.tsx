'use client'

export default function Home() {
    async function getUser() {
        const BASE = process.env.NEXT_PUBLIC_BASE_URL
        const response = await fetch(`${BASE}/api/me`)
        const data = await response.json()
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Hello World</h1>
            <button onClick={getUser}>Click Me</button>
        </main>
    )
}
