import User from '../models/User.js'
import ENDPOINTS from '../lib/endpoints.js'
import { timeAgo } from '../lib/utils.js'

export const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find()

        return res.status(200).json([...allUsers])
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Server Error',
        })
    }
}

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
        const recentlyPlayed = await fetchRecentlyPlayed(access_token)
        const genres = fetchTopGenresByArtist(artists.data)

        fetchErrors = profile.error
        fetchErrors = tracks.error
        fetchErrors = artists.error
        fetchErrors = recentlyPlayed.error

        return {
            data: {
                profile: profile.data,
                tracks: tracks.data,
                artists: artists.data,
                recentlyPlayed: recentlyPlayed.data,
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
                artists: item.artists.map((temp) => ({
                    ...temp,
                    id: `${token}-VibeMatch-${item.id}`,
                })),
                image: item.album.images[0],
                id: `${token}-VibeMatch-${item.id}`,
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
                id: `${token}-VibeMatch-${item.id}`,
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
                    artist.genres.forEach((genre) => {
                        counter['shortTerm'][genre] =
                            (counter['shortTerm'][genre] || 0) + 1
                    })
                }
            })
        }

        if (artists.hasOwnProperty('mediumTerm')) {
            artists.mediumTerm.forEach((artist) => {
                if (artist.genres.length) {
                    artist.genres.forEach((genre) => {
                        counter['mediumTerm'][genre] =
                            (counter['mediumTerm'][genre] || 0) + 1
                    })
                }
            })
        }

        if (artists.hasOwnProperty('longTerm')) {
            artists.longTerm.forEach((artist) => {
                if (artist.genres.length) {
                    artist.genres.forEach((genre) => {
                        counter['longTerm'][genre] =
                            (counter['longTerm'][genre] || 0) + 1
                    })
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

    async function fetchRecentlyPlayed(token) {
        const headers = {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        }

        let data = {}
        let error = null

        const response = await (
            await fetch(ENDPOINTS.player.recentlyPlayed, headers)
        ).json()

        if (response.hasOwnProperty('error')) {
            return { data, error: response.error.status }
        }

        if (response.items) {
            response.items.forEach((item, index) => {
                let day = item.played_at.split('T')[0]
                let track = {
                    artist: item.track.album.artists[0].name,
                    id: `${token}-INDEX-${index}-VibeMatch-${item.track.id}`,
                    image: item.track.album.images[0],
                    name: item.track.name,
                    timePlayed: timeAgo(item.played_at),
                }
                if (data.hasOwnProperty(day)) {
                    data[day] = [...data[day], track]
                } else {
                    data[day] = [track]
                }
            })
        }

        return { data, error }
    }

    try {
        const { data, error } = await fetchData()

        const existingUser = await User.findOne({ spotifyId: data.profile.id })

        if (existingUser) {
            existingUser.profile = data.profile
            existingUser.tracks = data.tracks
            existingUser.artists = data.artists
            existingUser.genres = data.genres
            existingUser.recentlyPlayed = data.recentlyPlayed
            existingUser.timestamp = data.timestamp
            const response = await existingUser.save()
            res.status(201).json({ response, error })
        } else {
            const newUser = new User({
                spotifyId: data.profile.id,
                profile: data.profile,
                tracks: data.tracks,
                artists: data.artists,
                genres: data.genres,
                recentlyPlayed: data.recentlyPlayed,
                timestamp: data.timestamp,
            })
            const response = await newUser.save()
            res.status(201).json({ response, error })
        }
    } catch (error) {
        console.error('Error details:', error)
        res.status(400).json({ message: error.message })
    }
}

// Error details:
//     MongoServerError:
//         E11000 duplicate key error collection:
//             test.users
//                 index: artists.shortTerm.id_1
//                     dup key: {
//                         artists.shortTerm.id: "0QitJHI0ZwMa5F9TR6EYSl"
//                     }
