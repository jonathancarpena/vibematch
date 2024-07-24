export async function GET(request: Request, response: Response) {
    const BASE_BACKEND = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    console.log(`${BASE_BACKEND}/users`)
    const res = await fetch(`${BASE_BACKEND}/users`) // Replace with your backend URL

    const data = await res.json()

    //   if (response.ok) {
    //       res.status(200).json(data)
    //   } else {
    //       res.status(response.status).json({ message: data.message })
    //   }

    return new Response('Failed to fetch data from backend', {
        status: 500,
    })

    return Response.json({ data: 'message' })
}
