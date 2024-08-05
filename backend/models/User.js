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
    id: { type: String, required: false, unique: false },
    name: { type: String, required: true },
    type: { type: String, required: true },
    uri: { type: String, required: true },
    image: { type: ImageSchema, required: false },
})

const TrackSchema = new Schema({
    id: { type: String, required: false, unique: false },
    artists: [ExpandedArtistSchema],
    image: { type: ImageSchema, required: false },
    name: { type: String, required: true },
    popularity: { type: Number, required: true },
})

const ArtistSchema = new Schema({
    id: { type: String, required: false, unique: false },
    genres: { type: [String], required: false },
    image: { type: ImageSchema, required: false },
    name: { type: String, required: true },
    popularity: { type: Number, required: true },
})

const ProfileSchema = new Schema({
    display_name: { type: String, required: true },
    id: { type: String, required: true },
    images: [ImageSchema],
})

const UserTracksSchema = new Schema({
    shortTerm: { type: [TrackSchema], required: false, unique: false },
    mediumTerm: { type: [TrackSchema], required: false, unique: false },
    longTerm: { type: [TrackSchema], required: false, unique: false },
})

const UserArtistsSchema = new Schema({
    shortTerm: { type: [ArtistSchema], required: false, unique: false },
    mediumTerm: { type: [ArtistSchema], required: false, unique: false },
    longTerm: { type: [ArtistSchema], required: false, unique: false },
})

const UserGenreSchema = new Schema({
    shortTerm: Object,
    mediumTerm: Object,
    longTerm: Object,
})

const UserSchema = new Schema({
    spotifyId: { type: String, required: true, unique: true },
    profile: ProfileSchema,
    tracks: { type: UserTracksSchema, unique: false },
    artists: { type: UserArtistsSchema, unique: false },
    genres: UserGenreSchema,
    timestamp: { type: Date, required: true },
})

// Create the User model
const User = model('User', UserSchema)
export default User
