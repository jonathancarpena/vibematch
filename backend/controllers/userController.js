import User from '../models/User.js'
import ENDPOINTS from '../lib/endpoints.js'

export const getUsers = async (req, res) => {}

export const createUser = async (req, res) => {
    let code = await req.body.code
    const clientId = process.env.CLIENT_ID || ''
    const clientSecret = process.env.CLIENT_SECRET || ''
    const redirectURI = `${process.env.CLIENT_BASE_URL}/callback/`

    async function fetchData() {
        let fetchErrors = null
        const { refresh_token } = await getAccessToken(
            code,
            clientId,
            clientSecret,
            redirectURI
        )

        const { access_token } = await getRefreshAccessToken(
            refresh_token,
            clientId,
            clientSecret
        )

        const profile = await fetchProfile(access_token)
        const tracks = await fetchTopTracks(access_token)
        const artists = await fetchTopArtists(access_token)
        const genres = fetchTopGenresByArtist(artists.data)

        fetchErrors = profile.error
        fetchErrors = tracks.error
        fetchErrors = artists.error

        return {
            data: {
                profile: profile.data,
                tracks: tracks.data,
                artists: artists.data,
                genres,
                timestamp: new Date(),
            },
            error: fetchErrors,
        }
    }

    async function getAccessToken(code, clientId, clientSecret, redirectURI) {
        const params = new URLSearchParams()
        params.append('client_id', clientId)
        params.append('client_secret', clientSecret)
        params.append('grant_type', 'authorization_code')
        params.append('code', code)
        params.append('redirect_uri', redirectURI)
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        })

        return await result.json()
    }

    async function getRefreshAccessToken(refreshToken, clientId, clientSecret) {
        const params = new URLSearchParams()
        params.append('client_id', clientId)
        params.append('client_secret', clientSecret)
        params.append('grant_type', 'refresh_token')
        params.append('refresh_token', refreshToken)

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        })
        return await result.json()
    }

    async function fetchProfile(token) {
        const headers = {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        }

        let data = {}
        let error = null
        const result = await (await fetch(ENDPOINTS.users.me, headers)).json()

        if (result.hasOwnProperty('error')) {
            return { data, error: result.error.status }
        }
        return { data: result, error }
    }

    async function fetchTopTracks(token) {
        const headers = {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        }

        let data = {}
        let error = null

        function addToResponse(key, result) {
            data = {
                ...data,
                [key]: result,
            }
        }

        function filterTrackResponse(tracks) {
            return tracks.map((item) => ({
                artists: item.artists,
                image: item.album.images[0],
                id: item.id,
                name: item.name,
                popularity: item.popularity,
            }))
        }

        async function fetchShortTerm() {
            const result = await fetch(ENDPOINTS.tracks.shortTerm, headers)
            return await result.json()
        }

        async function fetchMediumTerm() {
            const result = await fetch(ENDPOINTS.tracks.mediumTerm, headers)
            return await result.json()
        }

        async function fetchLongTerm() {
            const result = await fetch(ENDPOINTS.tracks.longTerm, headers)
            return await result.json()
        }

        const shortTerm = await fetchShortTerm()
        if (shortTerm.hasOwnProperty('error')) {
            return { data, error: shortTerm.error.status }
        }
        addToResponse('shortTerm', filterTrackResponse(shortTerm.items))

        const mediumTerm = await fetchMediumTerm()
        if (mediumTerm.hasOwnProperty('error')) {
            return { data, error: mediumTerm.error.status }
        }
        addToResponse('mediumTerm', filterTrackResponse(mediumTerm.items))

        const longTerm = await fetchLongTerm()
        if (longTerm.hasOwnProperty('error')) {
            return { data, error: longTerm.error.status }
        }
        addToResponse('longTerm', filterTrackResponse(longTerm.items))

        return { data, error }
    }

    async function fetchTopArtists(token) {
        const headers = {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        }

        let data = {}
        let error = null

        function addToResponse(key, result) {
            data = {
                ...data,
                [key]: result,
            }
        }

        function filterArtistResponse(artists) {
            return artists.map((item) => ({
                genres: item.genres,
                id: item.id,
                image: item.images[0],
                name: item.name,
                popularity: item.popularity,
            }))
        }

        async function fetchShortTerm() {
            const result = await fetch(ENDPOINTS.artists.shortTerm, headers)
            return await result.json()
        }

        async function fetchMediumTerm() {
            const result = await fetch(ENDPOINTS.artists.mediumTerm, headers)
            return await result.json()
        }

        async function fetchLongTerm() {
            const result = await fetch(ENDPOINTS.artists.longTerm, headers)
            return await result.json()
        }

        const shortTerm = await fetchShortTerm()
        if (shortTerm.hasOwnProperty('error')) {
            return { data, error: shortTerm.error.status }
        }
        addToResponse('shortTerm', filterArtistResponse(shortTerm.items))

        const mediumTerm = await fetchMediumTerm()
        if (mediumTerm.hasOwnProperty('error')) {
            return { data, error: mediumTerm.error.status }
        }
        addToResponse('mediumTerm', filterArtistResponse(mediumTerm.items))

        const longTerm = await fetchLongTerm()
        if (longTerm.hasOwnProperty('error')) {
            return { data, error: longTerm.error.status }
        }
        addToResponse('longTerm', filterArtistResponse(longTerm.items))

        return { data, error }
    }

    function fetchTopGenresByArtist(artists) {
        let counter = {
            shortTerm: {},
            mediumTerm: {},
            longTerm: {},
        }

        if (artists.hasOwnProperty('shortTerm')) {
            artists.shortTerm.forEach((artist) => {
                if (artist.genres.length) {
                    const category = artist.genres[0]
                    counter['shortTerm'][category] =
                        (counter['shortTerm'][category] || 0) + 1
                }
            })
        }

        if (artists.hasOwnProperty('mediumTerm')) {
            artists.mediumTerm.forEach((artist) => {
                if (artist.genres.length) {
                    const category = artist.genres[0]

                    counter['mediumTerm'][category] =
                        (counter['mediumTerm'][category] || 0) + 1
                }
            })
        }

        if (artists.hasOwnProperty('longTerm')) {
            artists.longTerm.forEach((artist) => {
                if (artist.genres.length) {
                    const category = artist.genres[0]

                    counter['longTerm'][category] =
                        (counter['longTerm'][category] || 0) + 1
                }
            })
        }

        const shortTerm = Object.entries(counter.shortTerm)
            .sort((a, b) => b[1] - a[1])
            .reduce(
                (_sortedObj, [k, v]) => ({
                    ..._sortedObj,
                    [k]: v,
                }),
                {}
            )

        const mediumTerm = Object.entries(counter.mediumTerm)
            .sort((a, b) => b[1] - a[1])
            .reduce(
                (_sortedObj, [k, v]) => ({
                    ..._sortedObj,
                    [k]: v,
                }),
                {}
            )

        const longTerm = Object.entries(counter.longTerm)
            .sort((a, b) => b[1] - a[1])
            .reduce(
                (_sortedObj, [k, v]) => ({
                    ..._sortedObj,
                    [k]: v,
                }),
                {}
            )

        return {
            shortTerm,
            mediumTerm,
            longTerm,
        }
    }

    try {
        const { data, error } = await fetchData()

        const newUser = new User({
            spotifyId: data.profile.id,
            profile: {
                display_name: data.profile.display_name,
                id: data.profile.id,
                images: data.profile.images,
            },
            tracks: data.tracks,
            artists: data.artists,
            genres: data.genres,
            timestamp: data.timestamp,
        })

        const existingUser = await User.findOne({ spotifyId: data.profile.id })

        if (existingUser) {
            existingUser.profile = data.profile
            existingUser.tracks = data.tracks
            existingUser.artists = data.artists
            existingUser.genres = data.genres
            existingUser.timestamp = data.timestamp
            await existingUser.save()
        } else {
            await newUser.save()
        }

        res.status(201).json({ data, error })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
