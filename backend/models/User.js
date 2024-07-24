import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
    spotifyId: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    favoriteTracks: [String],
    favoriteArtists: [String],
    favoriteGenres: [String],
})

const User = model('User', UserSchema)
export default User
