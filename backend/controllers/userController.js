import User from '../models/User.js'

export const getUsers = async (req, res) => {
    try {
        // const users = await User.find();
        res.status(200).json({ message: 'hello' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createUser = async (req, res) => {
    const {
        spotifyId,
        displayName,
        email,
        favoriteTracks,
        favoriteArtists,
        favoriteGenres,
    } = req.body
    const newUser = new User({
        spotifyId,
        displayName,
        email,
        favoriteTracks,
        favoriteArtists,
        favoriteGenres,
    })

    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
