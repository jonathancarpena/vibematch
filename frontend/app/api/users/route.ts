import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    const res = await fetch(`${BASE}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const data = await res.json()

    return NextResponse.json(data)
}
