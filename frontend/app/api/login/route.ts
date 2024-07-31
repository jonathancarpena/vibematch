import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
export async function POST(request: NextRequest) {
    const code = await request.json()
    if (code) {
        cookies().set('code', code, {
            secure: true,
            httpOnly: true,
        })
        const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

        const res = await fetch(`${BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        })

        const data = await res.json()

        return NextResponse.json({ data, ok: true })
    } else {
        return NextResponse.json({ ok: false })
    }
}
