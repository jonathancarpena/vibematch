import { Schema, model } from 'mongoose'

const ExternalUrlsSchema = new Schema({
    spotify: { type: String, required: true },
})

const ImageSchema = new Schema({
    url: { type: String, required: false },
    height: { type: Number },
    width: { type: Number },
})

const ExpandedArtistSchema = new Schema({
    external_urls: { type: ExternalUrlsSchema, required: true },
    href: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    uri: { type: String, required: true },
    image: { type: ImageSchema, required: false },
})

const TrackSchema = new Schema({
    artists: [ExpandedArtistSchema],
    image: { type: ImageSchema, required: false },
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    popularity: { type: Number, required: true },
})

const ArtistSchema = new Schema({
    genres: { type: [String], required: false },
    id: { type: String, required: true, unique: true },
    image: { type: ImageSchema, required: false },
    name: { type: String, required: true },
    popularity: { type: Number, required: true },
})

const ProfileSchema = new Schema({
    display_name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    images: [ImageSchema],
})

const UserTracksSchema = new Schema({
    shortTerm: [TrackSchema],
    mediumTerm: [TrackSchema],
    longTerm: [TrackSchema],
})

const UserArtistsSchema = new Schema({
    shortTerm: [ArtistSchema],
    mediumTerm: [ArtistSchema],
    longTerm: [ArtistSchema],
})

const UserGenreSchema = new Schema({
    shortTerm: Object,
    mediumTerm: Object,
    longTerm: Object,
})

const UserSchema = new Schema({
    spotifyId: { type: String, required: true, unique: true },
    profile: ProfileSchema,
    tracks: UserTracksSchema,
    artists: UserArtistsSchema,
    genres: UserGenreSchema,
    timestamp: { type: Date, required: true },
})

const User = model('User', UserSchema)
export default User
