import User from '../models/User.js'
import ENDPOINTS from '../lib/endpoints.js'

export const getUsers = async (req, res) => {}

export const createUser = async (req, res) => {
    console.log('create USER ')
    let code = req.body.code
    const clientId = process.env.CLIENT_ID || ''
    const clientSecret = process.env.CLIENT_SECRET || ''
    const redirectURI = `${process.env.CLIENT_BASE_URL}/`

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
        addToResponse('shortTerm', shortTerm.items)

        const mediumTerm = await fetchMediumTerm()
        if (mediumTerm.hasOwnProperty('error')) {
            return { data, error: mediumTerm.error.status }
        }
        addToResponse('mediumTerm', mediumTerm.items)

        const longTerm = await fetchLongTerm()
        if (longTerm.hasOwnProperty('error')) {
            return { data, error: longTerm.error.status }
        }
        addToResponse('longTerm', longTerm.items)

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
        addToResponse('shortTerm', shortTerm.items)

        const mediumTerm = await fetchMediumTerm()
        if (mediumTerm.hasOwnProperty('error')) {
            return { data, error: mediumTerm.error.status }
        }
        addToResponse('mediumTerm', mediumTerm.items)

        const longTerm = await fetchLongTerm()
        if (longTerm.hasOwnProperty('error')) {
            return { data, error: longTerm.error.status }
        }
        addToResponse('longTerm', longTerm.items)

        return { data, error }
    }

    async function fetchRecentlyPlayed(token) {
        const headers = {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        }

        let data = []
        let error = null

        const response = await (
            await fetch(ENDPOINTS.player.recentlyPlayed, headers)
        ).json()

        if (response.hasOwnProperty('error')) {
            return { data, error: response.error.status }
        }
        data = response.items
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
                } else {
                    counter['shortTerm']['undefined'] =
                        (counter['shortTerm']['undefined'] || 0) + 1
                }
            })
        }

        if (artists.hasOwnProperty('mediumTerm')) {
            artists.mediumTerm.forEach((artist) => {
                if (artist.genres.length) {
                    const category = artist.genres[0]
                    counter['mediumTerm'][category] =
                        (counter['mediumTerm'][category] || 0) + 1
                } else {
                    counter['mediumTerm']['undefined'] =
                        (counter['mediumTerm']['undefined'] || 0) + 1
                }
            })
        }

        if (artists.hasOwnProperty('longTerm')) {
            artists.longTerm.forEach((artist) => {
                if (artist.genres.length) {
                    const category = artist.genres[0]
                    counter['longTerm'][category] =
                        (counter['longTerm'][category] || 0) + 1
                } else {
                    counter['longTerm']['undefined'] =
                        (counter['longTerm']['undefined'] || 0) + 1
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

    const { data, error } = await fetchData()
    console.log(error)
    // try {
    //     // const savedUser = await newUser.save()
    //     console.log('BACKEND ')
    //     res.status(201).json(savedUser)
    // } catch (error) {
    //     res.status(400).json({ message: error.message })
    // }

    // const {
    //     spotifyId,
    //     displayName,
    //     email,
    //     favoriteTracks,
    //     favoriteArtists,
    //     favoriteGenres,
    // } = req.body
    // const newUser = new User({
    //     spotifyId,
    //     displayName,
    //     email,
    //     favoriteTracks,
    //     favoriteArtists,
    //     favoriteGenres,
    // })
    // try {
    //     const savedUser = await newUser.save()
    //     res.status(201).json(savedUser)
    // } catch (error) {
    //     res.status(400).json({ message: error.message })
    // }
}
