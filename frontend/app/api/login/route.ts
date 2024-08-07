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
        const URL = `${BASE}/users`

        const loginRes = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        })
        const { response, error } = await loginRes.json()

        const allUsersRes = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        let allUsers = await allUsersRes.json()
        allUsers = allUsers.filter((item: any) => item._id !== response._id)
        return NextResponse.json({ data: { response, allUsers }, ok: true })
    } else {
        return NextResponse.json({ ok: false })
    }
}
