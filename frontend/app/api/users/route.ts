import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    console.log('\n\n\nGET: High Scores')
    const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    const URL = `${BASE}/users/allUsers`
    const res = await fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const data = await res.json()

    return NextResponse.json(data)
}
