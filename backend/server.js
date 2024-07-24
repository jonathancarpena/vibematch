import dotenv from 'dotenv'
import express, { json, urlencoded } from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

// Conncet to MongoDB
connectDB()

// Express Server
const app = express()
app.use(cors())
app.use(json())
app.use(
    urlencoded({
        extended: false,
    })
)

// Routes
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
