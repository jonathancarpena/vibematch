function loginLink(): string {
    const URL = 'https://accounts.spotify.com/authorize'
    const SCOPES = [
        'playlist-read-private',
        'playlist-modify-private',
        'playlist-modify-public',
        'user-read-private',
        'user-top-read',
        'user-read-email',
        'user-read-currently-playing',
        'user-read-recently-played',
    ]
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
    const redirectURI = `${process.env.NEXT_PUBLIC_BASE_URL}/callback/`

    let SCOPE_PARAM = SCOPES.join('%20')
    return `${URL}?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${SCOPE_PARAM}&response_type=code&show_dialog=true`
}

const ENDPOINTS = {
    users: {
        me: 'https://api.spotify.com/v1/me',
    },
    tracks: {
        shortTerm:
            'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50',
        mediumTerm:
            'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50',
        longTerm:
            'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
    },
    artists: {
        shortTerm:
            'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50',
        mediumTerm:
            'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50',
        longTerm:
            'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50',
    },
    player: {
        recentlyPlayed: 'https://api.spotify.com/v1/me/player/recently-played',
    },
    login: loginLink(),
}

export default ENDPOINTS
