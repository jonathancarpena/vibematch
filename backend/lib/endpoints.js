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
}

export default ENDPOINTS
