export interface UserProfile {
    country: string
    display_name: string
    email: string
    explicit_content: {
        filter_enabled: boolean
        filter_locked: boolean
    }
    external_urls: { spotify: string }
    followers: { href: string | null; total: number }
    href: string | null
    id: string
    images: Image[]
    product: string
    type: string
    uri: string
}

export interface SimplifiedSpotifyArtist {
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
}
export interface SpotifyTrack {
    album: {
        album_type: string
        artists: SimplifiedSpotifyArtist[] | []
        available_markets: string[]
        external_urls: {
            spotify: string
        }
        href: string
        id: string
        image: Image[] | []
        name: string
        release_date: string
        release_date_precision: string
        genres?: string[]
        total_tracks: number
        type: string
        uri: string
    }
    artists: SimplifiedSpotifyArtist[] | []
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: object
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    image: Image
    is_playable: boolean
    linked_from: object
    restrictions: object
    name: string
    popularity: number
    preview_url: string | null
    track_number: number
    type: string
    uri: string
    is_local: boolean
}

export interface SpotifyArtist {
    external_urls: {
        spotify: string
    }
    followers: {
        href: null | string
        total: number
    }
    genres: string[]
    href: string
    id: string
    image: Image
    name: string
    popularity: number
    uri: string
    type: string
}

export interface SpotifyEpisode {
    audio_preview_url: string
    description: string
    html_description: string
    duration_ms: number
    explicit: boolean
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    images: Image[]
    is_externally_hosted: boolean
    is_playable: boolean
    languages: string[]
    name: string
    release_date: string
    release_date_precision: string
    resume_point: {
        fully_played: boolean
        resume_position_ms: number
    }
    type: string
    uri: string
    show: {
        description: string
        html_description: string
        explicit: boolean
        external_urls: {
            spotify: string
        }
        href: string
        id: string
        images: Image[]
        is_externally_hosted: boolean
        languages: string[]
        media_type: string
        name: string
        publisher: string
        type: string
        uri: string
        total_episodes: number
    }
}

export interface Image {
    url: string
    height: number | null
    width: number | null
}

export interface FetchResponse<Type> {
    data: Type | object
    error: number | null
}

export interface TopTracks {
    shortTerm: SpotifyTrack[] | []
    mediumTerm: SpotifyTrack[] | []
    longTerm: SpotifyTrack[] | []
}

export interface TopArtists {
    shortTerm: SpotifyArtist[] | []
    mediumTerm: SpotifyArtist[] | []
    longTerm: SpotifyArtist[] | []
}

export interface Genre {
    [category: string]: number
}

export interface TopGenre {
    shortTerm: Genre | {}
    mediumTerm: Genre | {}
    longTerm: Genre | {}
}

export interface PlayHistory {
    track: SpotifyTrack
    played_at: string
    context: {
        type: 'artist' | 'playlist' | 'album' | 'show'
        href: string
        external_urls: {
            spotify: string
        }
        uri: string
    }
}

export type TabOptions = 'tracks' | 'artists' | 'genre' | 'playlist'
export type TimeRanges = 'shortTerm' | 'mediumTerm' | 'longTerm'
export interface TimeRangePlaceholder {
    [key: string]: string
}
